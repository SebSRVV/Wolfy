import memberSchema, { MemberRanks, PetTypes } from "@/src/database/schemas/Member";
import { RankRoles } from "@/src/enums";
import { Client } from "@/src/lib/classes";
import {
    ChannelType,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    PermissionsBitField,
    EmbedBuilder,
    Colors,
    CategoryChannel,
    TextChannel,
} from "discord.js";

const addMember = async (client: Client, interaction: ChatInputCommandInteraction) => {
    try {
        // Diferir la respuesta para evitar errores por tiempo de espera
        await interaction.deferReply({ ephemeral: true });

        const selected = interaction.options.getUser("user");
        if (!selected) return interaction.editReply({ content: "Usuario no encontrado." });
        if (selected.bot) return interaction.editReply({ content: "No puedes seleccionar bots." });

        const role = interaction.options.getString("rank");
        if (!role) return interaction.editReply({ content: "Debes ingresar un rango." });

        const user = await memberSchema.findOne({ "discord.id": selected.id });
        if (user) return interaction.editReply({ content: "El usuario ya está registrado." });

        let category = interaction.options.getChannel("category");
        let channel = interaction.options.getChannel("channel");

        if (!category) {
            category = await interaction.guild?.channels.create({
                name: `PRIVATE ${selected.username}`,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    { id: selected.id, allow: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.guild?.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                ],
                position: 0,
                reason: "Creating private category for user",
            }) as CategoryChannel;
        }

        if (!channel) {
            channel = await interaction.guild?.channels.create({
                name: "【🌐】𝐏𝐑𝐈𝐕",
                type: ChannelType.GuildText,
                parent: category?.id,
                permissionOverwrites: [
                    { id: selected.id, allow: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.guild?.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                ],
                position: 0,
                reason: "Creating general channel for user",
            }) as TextChannel;
        }

        if (category?.type !== ChannelType.GuildCategory)
            return interaction.editReply({ content: "La categoría seleccionada no es válida." });
        if (channel?.type !== ChannelType.GuildText)
            return interaction.editReply({ content: "El canal seleccionado no es válido." });

        // Crear el nuevo registro del usuario en la base de datos sin mascota inicialmente
        await new memberSchema({
            discord: {
                id: selected.id,
                username: selected.username,
                category: category?.id,
                channel: channel?.id,
            },
            pet: null, // Sin mascota al inicio
            money: {
                economy: [],
                food: [],
            },
            rank: role,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).save();

        // Asignación del rol al miembro
        const member = await interaction.guild?.members.fetch(selected.id);
        const roleKey = role.charAt(0).toUpperCase() + role.slice(1);
        const roleID = RankRoles[roleKey as keyof typeof RankRoles];
        if (!roleID) return interaction.editReply({ content: "Rol inválido." });

        const roleAdded = await member?.roles.add(roleID).catch(() => false);
        if (!roleAdded) return interaction.editReply({ content: "No se pudo añadir el rol. Por favor, hacerlo manualmente." });

        // Preguntar al usuario qué mascota quiere adoptar
        if (channel instanceof TextChannel) {
            const welcomeMessage = await channel.send(
                `Bienvenido, ${selected.username}! Comienza tu aventura adoptando una mascota.\n\n` +
                `Por favor, responde con el número de la mascota que deseas adoptar:\n` +
                `1️⃣ **Perro** (Común)\n` +
                `2️⃣ **Gato** (Común)\n` +
                `3️⃣ **Conejo** (Inusual)\n` +
                `4️⃣ **Pájaro** (Épico)\n` +
                `5️⃣ **Lobo** (Raro)`
            );

            const filter = (response: any) =>
                response.author.id === selected.id &&
                ["1", "2", "3", "4", "5"].includes(response.content);

            const collector = channel.createMessageCollector({ filter, time: 60000 });

            collector.on("collect", async (response) => {
                collector.stop(); // Detener la recolección tras una respuesta válida

                let petType: PetTypes;
                let rarity: string;

                switch (response.content) {
                    case "1":
                        petType = PetTypes.Dog;
                        rarity = "Común";
                        break;
                    case "2":
                        petType = PetTypes.Cat;
                        rarity = "Común";
                        break;
                    case "3":
                        petType = PetTypes.Rabbit;
                        rarity = "Inusual";
                        break;
                    case "4":
                        petType = PetTypes.Bird;
                        rarity = "Épico";
                        break;
                    case "5":
                        petType = PetTypes.Wolf;
                        rarity = "Raro";
                        break;
                    default:
                        return;
                }

                // Guardar la mascota en la base de datos
                const pet = {
                    name: petType,
                    type: petType,
                    rarity: rarity,
                    xp: 0,
                    level: 1,
                    feed: 0,
                    starsEarned: 0,
                    time: new Date(),
                };

                await memberSchema.findOneAndUpdate(
                    { "discord.id": selected.id },
                    { $set: { pet: pet } }
                );

                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("🐾 ¡Mascota Adoptada!")
                    .setDescription(`¡Felicidades, ${selected.username}! Has adoptado una mascota.`)
                    .addFields(
                        { name: "Tipo", value: petType, inline: true },
                        { name: "Rareza", value: rarity, inline: true }
                    )
                    .setTimestamp();

                await channel.send({ embeds: [embed] });
            });

            collector.on("end", async (collected) => {
                if (collected.size === 0) {
                    await channel.send("⏰ No seleccionaste ninguna mascota a tiempo. Intenta nuevamente más tarde.");
                }
            });
        }

        await interaction.editReply({ content: "Usuario añadido correctamente. Canal privado creado." });
    } catch (error) {
        console.error(error);
        if (interaction.replied) {
            interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
        } else {
            interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
        }
    }
};

export default addMember;

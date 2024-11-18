import memberSchema, { MemberRanks, PetTypes } from "@/src/database/schemas/Member";
import { RankRoles } from "@/src/enums";
import { Client } from "@/src/lib/classes";
import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, PermissionsBitField, EmbedBuilder, Colors, CategoryChannel, TextChannel } from "discord.js";

// Definimos las mascotas disponibles con sus características y rareza
const petData = {
    wolf: { image: 'https://example.com/wolf.jpg', rarity: 'Raro', baseXp: 50, baseLevel: 2 },
    cat: { image: 'https://example.com/cat.jpg', rarity: 'Común', baseXp: 10, baseLevel: 1 },
    dog: { image: 'https://example.com/dog.jpg', rarity: 'Común', baseXp: 10, baseLevel: 1 },
    rabbit: { image: 'https://example.com/rabbit.jpg', rarity: 'Inusual', baseXp: 30, baseLevel: 1 },
    bird: { image: 'https://example.com/bird.jpg', rarity: 'Épico', baseXp: 80, baseLevel: 3 },
};

// Función para obtener una mascota aleatoria con rareza y características iniciales
function getRandomPet() {
    const petTypes = Object.keys(petData) as Array<keyof typeof petData>;
    const chances = [0.4, 0.3, 0.2, 0.08, 0.02];
    const random = Math.random();
    let cumulativeChance = 0;

    for (let i = 0; i < petTypes.length; i++) {
        cumulativeChance += chances[i];
        if (random < cumulativeChance) {
            return {
                type: petTypes[i],
                ...petData[petTypes[i]],
            };
        }
    }
    return { type: 'dog', ...petData.dog }; // Valor predeterminado en caso de error
}

const addMember = async (client: Client, interaction: ChatInputCommandInteraction) => {
    try {
        const selected = interaction.options.getUser("user");
        if (!selected) return interaction.reply({ content: "Usuario no encontrado.", ephemeral: true });
        if (selected.bot) return interaction.reply({ content: "No puedes seleccionar bots.", ephemeral: true });

        const role = interaction.options.getString("rank");
        if (!role) return interaction.reply({ content: "Debes ingresar un rango.", ephemeral: true });

        const user = await memberSchema.findOne({ "discord.id": selected.id });
        if (user) return interaction.reply({ content: "El usuario ya está registrado.", ephemeral: true });

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
            return interaction.reply({ content: "La categoría seleccionada no es válida.", ephemeral: true });
        if (channel?.type !== ChannelType.GuildText)
            return interaction.reply({ content: "El canal seleccionado no es válido.", ephemeral: true });

        // Asignación de una mascota aleatoria y sus propiedades iniciales
        const randomPet = getRandomPet();
        const pet = {
            name: `${randomPet.type} mascota`, // Ejemplo: "Wolf mascota"
            animal: randomPet.type,
            rarity: randomPet.rarity,
            level: randomPet.baseLevel,
            xp: randomPet.baseXp,
            foodReceived: 0,
            starsEarned: 0,
            image: randomPet.image, // Imagen generada con IA, debes reemplazar el enlace
            time: new Date(),
        };

        // Crear el nuevo registro del usuario en la base de datos con la mascota asignada
        await new memberSchema({
            discord: {
                id: selected.id,
                username: selected.username,
                category: category?.id,
                channel: channel?.id
            },
            pet: pet,
            money: {
                available: [],
                hold: []
            },
            rank: role,
            createdAt: new Date(),
            updatedAt: new Date()
        }).save();

        // Asignación del rol al miembro
        const member = await interaction.guild?.members.fetch(selected.id);
        const roleKey = role.charAt(0).toUpperCase() + role.slice(1);
        const roleID = RankRoles[roleKey as keyof typeof RankRoles];
        if (!roleID) return interaction.reply({ content: "Rol inválido.", ephemeral: true });

        const roleAdded = await member?.roles.add(roleID).catch(() => false);
        if (!roleAdded) return interaction.reply({ content: "No se pudo añadir el rol. Por favor, hacerlo manualmente.", ephemeral: true });

        // Crear un embed para la mascota y enviarlo en el canal privado
        if (channel instanceof TextChannel) {
            const petEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle(`¡🎉 Felicidades, ${selected.username}!`)
                .setDescription(`Has adoptado una nueva mascota. Cuida bien de ella y ayúdala a crecer.`)
                .addFields(
                    { name: "🐾 Nombre", value: pet.name, inline: true },
                    { name: "🐶 Animal", value: pet.animal.charAt(0).toUpperCase() + pet.animal.slice(1), inline: true },
                    { name: "🌟 Rareza", value: pet.rarity, inline: true },
                    { name: "⚡ Nivel", value: `${pet.level}`, inline: true },
                    { name: "🔹 Experiencia (XP)", value: `${pet.xp} XP`, inline: true },
                    { name: "🍖 Alimento Recibido", value: `${pet.foodReceived} veces`, inline: true },
                    { name: "⭐ Estrellas Ganadas", value: `${pet.starsEarned} estrellas`, inline: true }
                )
                .setThumbnail(pet.image) // Imagen de la mascota generada con IA
                .setFooter({ text: "¡Buena suerte con tu nueva mascota!" })
                .setTimestamp();

            await channel.send({ embeds: [petEmbed] });
        }

        interaction.reply({ content: "Usuario añadido correctamente con una nueva mascota.", ephemeral: true });
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

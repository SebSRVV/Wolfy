import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, Colors } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";
import { PetTypes } from "@/src/enums";

export const command: CommandInterface = {
    name: "adopt",
    description: "Adopta una nueva mascota y empieza tu aventura.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "nombre",
            description: "Elige un nombre para tu nueva mascota.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "tipo",
            description: "Elige el tipo de mascota que deseas adoptar.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: Object.values(PetTypes).map((type) => ({
                name: type.charAt(0).toUpperCase() + type.slice(1),
                value: type,
            })),
        },
    ],

    async run(client, interaction) {
        const name = interaction.options.getString("nombre", true);
        const type = interaction.options.getString("tipo", true);

        // Validar el nombre
        if (name.length < 3 || name.length > 20) {
            return interaction.reply({
                content: "❌ El nombre de la mascota debe tener entre 3 y 20 caracteres.",
                ephemeral: true,
            });
        }

        // Buscar al usuario en la base de datos
        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });

        if (member && member.pet) {
            return interaction.reply({
                content: "❌ Ya tienes una mascota. Usa `/abandon` para abandonar tu mascota actual antes de adoptar otra.",
                ephemeral: true,
            });
        }

        // Crear los datos básicos de la nueva mascota
        const newPet = {
            name,
            type,
            rarity: "common", // Rareza inicial
            level: 1,
            xp: 0,
            feed: 0,
            starsEarned: 0,
            time: new Date(),
            stats: {
                health: 100,
                shield: 10,
                attack: 5,
                agility: 1,
                critChance: 5,
                critDamage: 20,
            },
            items: [], // Sin ítems al inicio
        };

        if (!member) {
            // Crear un nuevo usuario y agregar la mascota
            await memberSchema.create({
                discord: { id: interaction.user.id, username: interaction.user.username },
                money: { economy: [], food: [] },
                logs: [],
                rank: "novice",
                hide: false,
                pet: newPet,
            });
        } else {
            // Si el usuario ya existe pero no tiene mascota, agregarla
            member.pet = newPet;
            await member.save();
        }

        // Embed para mostrar la información de la mascota adoptada
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("🐾 ¡Felicidades por tu nueva mascota!")
            .setDescription(
                `Has adoptado un **${type.charAt(0).toUpperCase() + type.slice(1)}** llamado **${name}**.\n` +
                `Cuida bien de tu mascota y ayúdala a crecer.`
            )
            .addFields(
                { name: "🌟 Rareza", value: "Común", inline: true },
                { name: "⚡ Nivel", value: "1", inline: true },
                { name: "❤️ Vida", value: "100", inline: true },
                { name: "🛡️ Escudo", value: "10", inline: true },
                { name: "⚔️ Ataque", value: "5", inline: true },
                { name: "⚡ Agilidad", value: "1 ataque/s", inline: true },
                { name: "🔥 Prob. Crítica", value: "5%", inline: true },
                { name: "💥 Daño Crítico", value: "20%", inline: true }
            )
            .setThumbnail(interaction.user.displayAvatarURL({  }))
            .setFooter({ text: "¡Sigue cuidando de tu mascota y mejora sus estadísticas!" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

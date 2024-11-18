import {
    ApplicationCommandType,
    EmbedBuilder,
    Colors
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema from "@schemas/Member";
import { PetTypes } from "@/src/enums";
import { MemberRanks } from "@schemas/Member";

export const command: CommandInterface = {
    name: "info",
    description: "Muestra la información de tu mascota y tu rango de entrenador.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        // Buscar el miembro en la base de datos
        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });

        if (!member) {
            const noAccountEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("❌ ¡Sin Cuenta Registrada!")
                .setDescription("No tienes una cuenta registrada. Usa el comando de registro primero.")
                .setFooter({ text: "¡Regístrate para empezar a adoptar!" })
                .setTimestamp();

            return await interaction.reply({ embeds: [noAccountEmbed], ephemeral: true });
        }

        if (!member.pet) {
            const noPetEmbed = new EmbedBuilder()
                .setColor(Colors.Yellow)
                .setTitle("🐾 ¡Sin Mascota Adoptada!")
                .setDescription("No tienes una mascota adoptada. Usa el comando de adopción para conseguir una.")
                .setFooter({ text: "¡Adopta a una mascota y empieza la aventura!" })
                .setTimestamp();

            return await interaction.reply({ embeds: [noPetEmbed], ephemeral: true });
        }

        // Obtener información de la mascota y del usuario
        const { name = "Mascota", type = "desconocido", rarity = "común", level = 1, xp = 0, feed = 0, starsEarned = 0, time = Date.now() } = member.pet || {};
        const rank = member.rank || MemberRanks.Novice;
        const adoptionDate = new Date(time);
        const daysTogether = Math.floor((Date.now() - adoptionDate.getTime()) / (1000 * 60 * 60 * 24));

        // Progreso de experiencia al próximo rango
        let xpNeededForNextLevel = 100;
        let xpProgress = xp;
        
        if (rank === MemberRanks.Trainer) {
            xpNeededForNextLevel = 200;
        } else if (rank === MemberRanks.Master) {
            xpNeededForNextLevel = 300;
        }

        const progressPercentage = ((xp / xpNeededForNextLevel) * 100).toFixed(2);

        // Crear embed de información de la mascota
        const infoEmbed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(`✨ Información de tu Mascota y Entrenador`)
            .setDescription("Aquí tienes los detalles de tu mascota y tu rango de entrenador:")
            .addFields(
                { name: "🦮 Nombre", value: name, inline: true },
                { name: "🐶 Animal", value: type.charAt(0).toUpperCase() + type.slice(1), inline: true },
                { name: "🌟 Rareza", value: rarity, inline: true },
                { name: "⚡ Nivel", value: `${level}`, inline: true },
                { name: "🔹 XP Actual", value: `${xp} XP`, inline: true },
                { name: "🍖 Alimento Recibido", value: `${feed} veces`, inline: true },
                { name: "⭐ Estrellas Ganadas", value: `${starsEarned} estrellas`, inline: true },
                { name: "🏅 Rango de Entrenador", value: rank, inline: true },
                { name: "📅 Tiempo Juntos", value: `${daysTogether} días`, inline: true },
                { name: "📈 Progreso de XP", value: `${progressPercentage}% hacia el próximo rango (${xp}/${xpNeededForNextLevel})`, inline: false }
            )
            .setFooter({ text: "¡Continúa cuidando de tu mascota para mejorar tu rango!" })
            .setTimestamp();

        await interaction.reply({ embeds: [infoEmbed] });
    }
};

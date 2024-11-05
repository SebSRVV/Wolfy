import {
    ApplicationCommandType,
    EmbedBuilder,
    Colors,
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema from "@schemas/Member";

export const command: CommandInterface = {
    name: "pet",
    description: "Acaricia a tu mascota para que suba de nivel.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        // Buscar el miembro en la base de datos
        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });
        if (!member) {
            return await interaction.reply({
                content: "No tienes una cuenta registrada. Usa el comando de registro primero.",
                ephemeral: true,
            });
        }

        // Verificar si el miembro tiene una mascota
        if (!member.pet) {
            return await interaction.reply({
                content: "No tienes una mascota adoptada. Usa el comando de adopción para conseguir una.",
                ephemeral: true,
            });
        }

        // Generar XP aleatorio entre 2 y 12
        const xpGained = Math.floor(Math.random() * (12 - 2 + 1)) + 2; // Genera un número entre 2 y 12
        member.pet.xp += xpGained; // Incrementa la XP de la mascota

        // Verificar si se debe aumentar el nivel de la mascota
        const levelUpXP = 100; // Ejemplo de XP necesaria para subir de nivel
        if (member.pet.xp >= levelUpXP) {
            member.pet.xp -= levelUpXP; // Reiniciar XP y aumentar el nivel
            member.pet.level += 1;
            await interaction.reply({
                content: `🎉 ¡Has acariciado a tu mascota! Ganó ${xpGained} XP y ha subido de nivel a ${member.pet.level}. Ahora tiene ${member.pet.xp} XP.`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: `🐾 ¡Acariciaste a tu mascota! Ganó ${xpGained} XP. Ahora tiene ${member.pet.xp} XP.`,
                ephemeral: true,
            });
        }

        // Guardar los cambios en la base de datos
        await member.save();
    }
};

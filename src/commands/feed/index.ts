import { ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, Colors } from "discord.js";
import memberSchema from "@/src/database/schemas/Member";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "feed",
    description: "Alimenta a tu mascota utilizando cinamons.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction: ChatInputCommandInteraction) {
        try {
            const userId = interaction.user.id;

            // Buscar el miembro en la base de datos
            const member = await memberSchema.findOne({ "discord.id": userId });
            if (!member) {
                return interaction.reply({
                    content: "No tienes una cuenta registrada. Usa `/adopt` para empezar.",
                    ephemeral: true,
                });
            }

            // Verificar si el usuario tiene una mascota
            if (!member.pet) {
                return interaction.reply({
                    content: "No tienes una mascota para alimentar. Usa `/adopt` para adoptar una.",
                    ephemeral: true,
                });
            }

            // Verificar si tiene cinamons suficientes
            const availableCinamons = member.money.food.reduce((sum, item) => sum + item.amount, 0);
            if (availableCinamons <= 0) {
                return interaction.reply({
                    content: "No tienes suficientes cinamons para alimentar a tu mascota.",
                    ephemeral: true,
                });
            }

            // Gastar un cinamon para alimentar
            const newFoodLog = {
                amount: -1, // Gastar un cinamon
                reason: "Alimentar a la mascota",
                date: new Date(),
            };
            member.money.food.push(newFoodLog);

            // Incrementar el contador de alimentación y experiencia
            member.pet.feed += 1;
            member.pet.xp += 10; // Dar 10 de XP por cada alimento

            // Revisar si sube de nivel
            if (member.pet.xp >= 100) {
                member.pet.level += 1;
                member.pet.xp -= 100; // Restar el XP necesario para el nivel
            }

            // Guardar los cambios en la base de datos
            await member.save();

            // Responder con un embed de confirmación
            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle("🍖 ¡Alimentaste a tu Mascota!")
                .setDescription("Tu mascota ha sido alimentada exitosamente.")
                .addFields(
                    { name: "Mascota", value: member.pet.name, inline: true },
                    { name: "Nivel", value: `${member.pet.level}`, inline: true },
                    { name: "XP Actual", value: `${member.pet.xp}/100`, inline: true },
                    { name: "Veces Alimentada", value: `${member.pet.feed}`, inline: true },
                    { name: "Cinamons Restantes", value: `${availableCinamons - 1}`, inline: true }
                )
                .setFooter({ text: "Sigue cuidando de tu mascota para que crezca fuerte." })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "Ocurrió un error al intentar alimentar a tu mascota.",
                ephemeral: true,
            });
        }
    },
};

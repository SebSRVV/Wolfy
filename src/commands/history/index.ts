import { ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema from "@/src/database/schemas/Member";
import { Emojis } from "@/src/enums";

export const command: CommandInterface = {
    name: "history",
    description: "Consulta el historial de transacciones de tu cuenta.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        try {
            const userId = interaction.user.id;

            // Buscar el miembro en la base de datos
            const member = await memberSchema.findOne({ "discord.id": userId }).select("money");
            if (!member) {
                return interaction.reply({
                    content: "No tienes una cuenta registrada. Usa `/adopt` para empezar.",
                    ephemeral: true,
                });
            }

            // Verificar y obtener los historiales de economía y comida
            const economyHistory = Array.isArray(member.money.economy) ? member.money.economy : [];
            const foodHistory = Array.isArray(member.money.food) ? member.money.food : [];

            // Formatear los últimos 5 movimientos de economía
            const formattedEconomyHistory = economyHistory
                .slice(-5) // Obtener los últimos 5 movimientos
                .reverse() // Ordenar del más reciente al más antiguo
                .map(
                    (item, index) =>
                        `${index + 1}. ${item.amount > 0 ? Emojis.Up : Emojis.Down} **${item.amount.toFixed(
                            2
                        )} STR** - ${item.reason} (${new Date(item.date).toLocaleString()})`
                )
                .join("\n") || "Sin movimientos recientes.";

            // Formatear los últimos 5 movimientos de comida
            const formattedFoodHistory = foodHistory
                .slice(-5) // Obtener los últimos 5 movimientos
                .reverse() // Ordenar del más reciente al más antiguo
                .map(
                    (item, index) =>
                        `${index + 1}. ${item.amount > 0 ? Emojis.Up : Emojis.Down} **${item.amount} Cinamons** - ${
                            item.reason
                        } (${new Date(item.date).toLocaleString()})`
                )
                .join("\n") || "Sin movimientos recientes.";

            // Crear un embed con el historial
            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle(`**HISTORIAL DE TRANSACCIONES**`)
                .setDescription(`Historial de tus últimas transacciones.`)
                .addFields(
                    { name: `${Emojis.COIN} Economía (STR)`, value: formattedEconomyHistory, inline: false },
                    { name: `${Emojis.TREAT} Comida (Cinamons)`, value: formattedFoodHistory, inline: false }
                )
                .setFooter({ text: "Consulta detallada de tus movimientos." })
                .setTimestamp();

            // Responder al usuario
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                await interaction.editReply({
                    content: "Ocurrió un error al intentar consultar tu historial.",
                });
            } else {
                await interaction.reply({
                    content: "Ocurrió un error al intentar consultar tu historial.",
                    ephemeral: true,
                });
            }
        }
    },
};

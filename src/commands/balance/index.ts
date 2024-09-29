import { ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

import memberSchema from "@schemas/Member";
import { Emojis } from "@/src/enums";

export const command: CommandInterface = {
    name: "balance",
    description: "Consulta el balance de un miembro.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        try {
            const miembro = interaction.user.id;

            // No es necesario verificar "miembro" ya que interaction.user.id siempre estará presente
            const member = await memberSchema.findOne({ "discord.id": miembro }).select("discord.id money");
            if (!member) {
                return interaction.reply({
                    content: "El miembro no tiene una cuenta registrada.",
                    ephemeral: true
                });
            }

            const username = 
                (await interaction.guild?.members.fetch(miembro).then(member => member.user.username)) ||
                member.discord.username;

            // Verificar que money.economy y money.Food existan y sean arreglos
            const economy = Array.isArray(member.money.economy) ? member.money.economy : [];
            const food = Array.isArray(member.money.food) ? member.money.food : [];

            const availableStars = economy.reduce((acc, curr) => acc + curr.amount, 0) || 0;
            const holdCinamons = food.reduce((acc, curr) => acc + curr.amount, 0) || 0;

            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle(`**BALANCE DE ${username.toUpperCase()}**`)
                .setDescription(
                    `${Emojis.SPARKLE} **Estrellas Disponibles:**\n- ${Emojis.COIN} **STR:** ${availableStars.toFixed(2)}\n${Emojis.SPARKLE} **Comida:**\n- ${Emojis.TREAT} **Cinamons:** ${holdCinamons.toFixed(2)}`
                )
                .setFooter({
                    text: `Actualizado:`
                })
                .setTimestamp();

            interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                await interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
            } else {
                await interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
            }
        }
    }
};

import { ApplicationCommandType, EmbedBuilder, Colors } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "mining",
    description: "Cava en la mina y encuentra minerales valiosos.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        const userId = interaction.user.id;
        const member = await memberSchema.findOne({ "discord.id": userId });

        if (!member) {
            return interaction.reply({
                content: "No se pudo encontrar tu perfil. Usa `/register` para empezar.",
                ephemeral: true,
            });
        }

        const miningRewards = [
            { item: "🪨 Piedra", value: 5 },
            { item: "⛏️ Hierro", value: 15 },
            { item: "💎 Diamante", value: 50 },
            { item: "❌ Nada encontrado", value: 0 },
        ];
        const miningResult = miningRewards[Math.floor(Math.random() * miningRewards.length)];

        if (miningResult.value > 0) {
            member.money.economy.push({ amount: miningResult.value, reason: "Minería", date: new Date() });
            await member.save();
        }

        const embed = new EmbedBuilder()
            .setColor(miningResult.value > 0 ? Colors.Gold : Colors.Red)
            .setTitle("⛏️ Minería")
            .setDescription(
                `⛏️ **Resultado:** ${miningResult.item}\n` +
                `💰 **Recompensa:** ${miningResult.value > 0 ? `${miningResult.value} estrellas` : "Nada encontrado"}`
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

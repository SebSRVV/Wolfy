import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "treasurehunt",
    description: "Explora y encuentra tesoros escondidos.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        const treasures = ["⭐ Estrellas", "💎 Gemas", "🎁 Cofres misteriosos"];
        const foundTreasure = treasures[Math.floor(Math.random() * treasures.length)];

        const userId = interaction.user.id;
        const member = await memberSchema.findOne({ "discord.id": userId });

        if (!member) {
            return interaction.reply({
                content: "No se pudo encontrar tu perfil. Usa `/register` para empezar.",
                ephemeral: true,
            });
        }

        const rewardAmount = Math.floor(Math.random() * 50) + 10;

        if (foundTreasure === "⭐ Estrellas") {
            member.money.economy.push({ amount: rewardAmount, reason: "Búsqueda del tesoro", date: new Date() });
        }

        await member.save();

        const embed = new EmbedBuilder()
            .setColor(0x1e90ff)
            .setTitle("🗺️ ¡Búsqueda del Tesoro!")
            .setDescription(
                `🔍 **Encontraste un tesoro escondido:** ${foundTreasure}\n` +
                `💰 **Recompensa:** ${rewardAmount} ${foundTreasure.includes("Estrellas") ? "estrellas" : "objetos"}`
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

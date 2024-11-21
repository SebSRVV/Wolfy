import { ApplicationCommandType, EmbedBuilder, Colors } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "explore",
    description: "Explora diferentes regiones y encuentra recursos.",
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

        const regions = ["Selva", "Cueva", "Montaña", "Playa"];
        const selectedRegion = regions[Math.floor(Math.random() * regions.length)];
        const explorationRewards = [
            { item: "🌿 Hierba", value: 10 },
            { item: "🪙 Moneda Antigua", value: 20 },
            { item: "🏺 Reliquia Rara", value: 50 },
            { item: "❌ Nada encontrado", value: 0 },
        ];
        const explorationResult = explorationRewards[Math.floor(Math.random() * explorationRewards.length)];

        if (explorationResult.value > 0) {
            member.money.economy.push({ amount: explorationResult.value, reason: "Exploración", date: new Date() });
            await member.save();
        }

        const embed = new EmbedBuilder()
            .setColor(explorationResult.value > 0 ? Colors.Green : Colors.Red)
            .setTitle("🗺️ Exploración")
            .setDescription(
                `🌍 **Región Explorada:** ${selectedRegion}\n` +
                `🔍 **Resultado:** ${explorationResult.item}\n` +
                `💰 **Recompensa:** ${explorationResult.value > 0 ? `${explorationResult.value} estrellas` : "Nada encontrado"}`
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

import { ApplicationCommandType, EmbedBuilder, Colors } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "fishing",
    description: "Lánzate a pescar y atrapa recursos.",
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

        // Resultados de la pesca
        const fishingRewards = [
            { item: "🐟 Pez Pequeño", value: 10 },
            { item: "🐡 Pez Globo", value: 20 },
            { item: "🦈 Tiburón", value: 50 },
            { item: "🚫 Nada atrapado", value: 0 },
        ];
        const catchResult = fishingRewards[Math.floor(Math.random() * fishingRewards.length)];

        if (catchResult.value > 0) {
            member.money.food.push({ amount: catchResult.value, reason: "Pesca", date: new Date() });
            await member.save();
        }

        const embed = new EmbedBuilder()
            .setColor(catchResult.value > 0 ? Colors.Green : Colors.Red)
            .setTitle("🎣 ¡Pesca Exitosa!")
            .setDescription(
                `🎣 **Resultado:** ${catchResult.item}\n` +
                `💰 **Recompensa:** ${catchResult.value > 0 ? `${catchResult.value} comida` : "Nada atrapado"}`
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

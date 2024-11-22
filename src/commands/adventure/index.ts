import { ApplicationCommandOptionType, ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "adventure",
    description: "Embárcate en una aventura para ganar experiencia y recursos.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "dificultad",
            description: "Elige la dificultad de la aventura.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "Fácil", value: "easy" },
                { name: "Normal", value: "normal" },
                { name: "Difícil", value: "hard" },
            ],
        },
    ],

    async run(client, interaction) {
        const difficulty = interaction.options.getString("dificultad")!;
        const duration = difficulty === "easy" ? 5000 : difficulty === "normal" ? 60000 : 600000;

        const userId = interaction.user.id;
        const member = await memberSchema.findOne({ "discord.id": userId });

        if (!member || !member.pet) {
            return interaction.reply({
                content: "No tienes una mascota para enviar en una aventura. Usa `/adopt` para adoptar una.",
                ephemeral: true,
            });
        }

        await interaction.reply(`🌍 **¡Tu aventura ha comenzado!** (Dificultad: ${difficulty}) Te llevará ${duration / 1000} segundos...`);

        setTimeout(async () => {
            try {
                const earnedStars = Math.floor(Math.random() * (difficulty === "hard" ? 100 : difficulty === "normal" ? 50 : 20)) + 1;
                const earnedXp = Math.floor(Math.random() * (difficulty === "hard" ? 70 : difficulty === "normal" ? 40 : 20)) + 1;

                member.money.economy.push({ amount: earnedStars, reason: "Aventura", date: new Date() });
                member.pet.xp += earnedXp;
                let leveledUp = false;

                if (member.pet.xp >= 100) {
                    member.pet.level += 1;
                    member.pet.xp -= 100;
                    leveledUp = true;
                }

                await member.save();

                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle(`**¡Aventura Exitosa!**`)
                    .setDescription(
                        `🌟 **Recompensas:**\n` +
                        `- ⭐ **Estrellas:** ${earnedStars}\n` +
                        `- ⚡ **Experiencia:** ${earnedXp}`
                    )
                    .addFields(
                        { name: "🏅 Nivel Actual", value: `${member.pet.level}`, inline: true },
                        { name: "🔹 Experiencia Actual", value: `${member.pet.xp} XP`, inline: true },
                        { name: "⭐ Total de Estrellas", value: `${member.money.economy.reduce((sum, item) => sum + item.amount, 0)}`, inline: true }
                    )
                    .setFooter({ text: leveledUp ? "¡Tu mascota ha subido de nivel!" : "Continúa explorando para ganar más experiencia." })
                    .setTimestamp();

                await interaction.followUp({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.followUp({ content: "Ocurrió un error al completar la aventura.", ephemeral: true });
            }
        }, duration);
    },
};

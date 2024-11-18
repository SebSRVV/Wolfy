import { ApplicationCommandOptionType, ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema, { MemberRanks } from "@schemas/Member";
import { Emojis } from "@/src/enums";

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
        let duration: number;

        // Duración de la aventura según la dificultad
        switch (difficulty) {
            case "easy":
                duration = 5000; // 5 segundos
                break;
            case "normal":
                duration = 60000; // 1 minuto
                break;
            case "hard":
                duration = 600000; // 10 minutos
                break;
            default:
                return interaction.reply({ content: "Dificultad no válida.", ephemeral: true });
        }

        const userId = interaction.user.id;
        
        // Verificar si el usuario tiene una mascota
        let member = await memberSchema.findOne({ "discord.id": userId });
        if (!member || !member.pet) {
            return interaction.reply({
                content: "No tienes una mascota para enviar en una aventura. Usa `/adopt` para adoptar una.",
                ephemeral: true,
            });
        }

        await interaction.reply(`🌍 **¡Tu aventura ha comenzado!** (Dificultad: ${difficulty}) Te llevará ${duration / 1000} segundos...`);

        // Simular el tiempo de aventura
        setTimeout(async () => {
            try {
                // Generar aleatoriamente experiencia y recursos según la dificultad
                const earnedStars = Math.floor(Math.random() * (difficulty === "hard" ? 100 : difficulty === "normal" ? 50 : 20)) + 1;
                const earnedFood = Math.floor(Math.random() * (difficulty === "hard" ? 40 : difficulty === "normal" ? 20 : 10)) + 1;
                const earnedXp = Math.floor(Math.random() * (difficulty === "hard" ? 70 : difficulty === "normal" ? 40 : 20)) + 1;

                // Agregar recursos ganados al miembro
                member.money.economy.push({ amount: earnedStars, reason: "Aventura", date: new Date() });
                member.money.food.push({ amount: earnedFood, reason: "Aventura", date: new Date() });
                
                // Incrementar la experiencia de la mascota y revisar nivel
                member.pet.xp += earnedXp;
                let leveledUp = false;

                // Subir de nivel si la XP supera el umbral
                if (member.pet.xp >= 100) {
                    member.pet.level += 1;
                    member.pet.xp -= 100;
                    leveledUp = true;
                }

                await member.save();

                // Crear un embed para mostrar los resultados
                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle(`**¡Aventura Exitosa!**`)
                    .setDescription(
                        `${Emojis.SPARKLE} **Tu mascota ha ganado:**\n` +
                        `- ${Emojis.COIN} **Estrellas:** ${earnedStars}\n` +
                        `- ${Emojis.TREAT} **Cinamones:** ${earnedFood}\n` +
                        `- ⚡ **Experiencia:** ${earnedXp} XP`
                    )
                    .addFields(
                        { name: "🏅 Nivel Actual", value: `${member.pet.level}`, inline: true },
                        { name: "🔹 Experiencia Actual", value: `${member.pet.xp} XP`, inline: true },
                        { name: "⭐ Total de Estrellas", value: `${member.money.economy.reduce((sum, item) => sum + item.amount, 0)}`, inline: true }
                    )
                    .setFooter({
                        text: leveledUp ? "¡Tu mascota ha subido de nivel!" : "Continúa explorando para ganar más experiencia."
                    })
                    .setTimestamp();

                await interaction.followUp({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.followUp({ content: "Ocurrió un error al completar la aventura.", ephemeral: true });
            }
        }, duration);
    }
};

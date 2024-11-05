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

        // Establecer el tiempo de duración según la dificultad
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

        await interaction.reply(`🌍 **¡Tu aventura ha comenzado!** (Dificultad: ${difficulty}) Te llevará ${duration / 1000} segundos...`);

        // Simular el tiempo de aventura con un temporizador
        setTimeout(async () => {
            try {
                const userId = interaction.user.id;

                // Buscar al miembro en la base de datos
                let member = await memberSchema.findOne({ "discord.id": userId });

                // Si el miembro no existe, crearlo
                if (!member) {
                    member = new memberSchema({
                        discord: {
                            id: userId,
                            username: interaction.user.username,
                        },
                        money: {
                            economy: [],
                            food: [],
                        },
                        logs: [],
                        rank: MemberRanks.Novice,
                        hide: false,
                    });
                    await member.save();
                }

                // Generar aleatoriamente experiencia y comida según la dificultad
                const earnedStars = Math.floor(Math.random() * (difficulty === "hard" ? 100 : difficulty === "normal" ? 50 : 20)) + 1; // Gana más estrellas con mayor dificultad
                const earnedFood = Math.floor(Math.random() * (difficulty === "hard" ? 40 : difficulty === "normal" ? 20 : 10)) + 1; // Gana más cinamones con mayor dificultad

                // Agregar los recursos ganados a la economía y comida
                member.money.economy.push({ amount: earnedStars, reason: "Aventura", date: new Date() });
                member.money.food.push({ amount: earnedFood, reason: "Aventura", date: new Date() });
                await member.save();

                // Crear un embed para mostrar los resultados
                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle(`**¡Aventura Exitosa!**`)
                    .setDescription(
                        `${Emojis.SPARKLE} **Has ganado:**\n` +
                        `- ${Emojis.COIN} **Estrellas:** ${earnedStars}\n` +
                        `- ${Emojis.TREAT} **Cinamones:** ${earnedFood}`
                    )
                    .setFooter({
                        text: `Consulta tu balance con /balance`
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

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
        const userId = interaction.user.id;

        const member = await memberSchema.findOne({ "discord.id": userId });

        if (!member || !member.pet) {
            return interaction.reply({
                content: "❌ No tienes una mascota para enviar en una aventura. Usa `/adopt` para adoptar una.",
                ephemeral: true,
            });
        }

        // Desestructuramos pet para evitar el problema de acceso a `undefined`
        const pet = member.pet;

        // Definir las recompensas y la duración según la dificultad
        const settings = {
            easy: { duration: 5000, stars: [5, 15], xp: [10, 20] },
            normal: { duration: 30000, stars: [20, 40], xp: [25, 50] },
            hard: { duration: 6000, stars: [50, 100], xp: [60, 120] },
        };

        const { duration, stars, xp } = settings[difficulty];

        await interaction.reply(`🌍 **¡Tu aventura ha comenzado!** (Dificultad: ${difficulty.toUpperCase()}) Te llevará ${duration / 1000} segundos...`);

        setTimeout(async () => {
            try {
                // Generar recompensas aleatorias dentro de los rangos
                const earnedStars = Math.floor(Math.random() * (stars[1] - stars[0] + 1)) + stars[0];
                const earnedXp = Math.floor(Math.random() * (xp[1] - xp[0] + 1)) + xp[0];

                // Actualizar economía y experiencia
                member.money.economy.push({ amount: earnedStars, reason: "Aventura", date: new Date() });
                pet.xp += earnedXp;

                // Verificar si sube de nivel
                let leveledUp = false;
                if (pet.xp >= 100) {
                    pet.level += 1;
                    pet.xp -= 100;
                    leveledUp = true;
                }

                // Guardar cambios en la base de datos
                await member.save();

                // Calcular estadísticas actuales de la mascota
                const { health, shield, attack, agility, critChance, critDamage } = pet.stats;
                const totalStars = member.money.economy.reduce((sum, entry) => sum + entry.amount, 0);

                // Crear embed con las recompensas
                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle(`🌟 **¡Aventura Exitosa!**`)
                    .setDescription(
                        `🎉 **Recompensas Obtenidas:**\n` +
                        `- ⭐ **Estrellas:** ${earnedStars}\n` +
                        `- ⚡ **Experiencia:** ${earnedXp}\n`
                    )
                    .addFields(
                        { name: "🏅 Nivel Actual", value: `${pet.level}`, inline: true },
                        { name: "🔹 Experiencia Actual", value: `${pet.xp} XP`, inline: true },
                        { name: "⭐ Total de Estrellas", value: `${totalStars}`, inline: true },
                        { name: "📊 Estadísticas de Mascota", value: 
                            `❤️ Vida: ${health}\n` +
                            `🛡️ Escudo: ${shield}\n` +
                            `⚔️ Ataque: ${attack}\n` +
                            `⚡ Agilidad: ${agility}\n` +
                            `🔥 Probabilidad Crítica: ${critChance}%\n` +
                            `💥 Daño Crítico: ${critDamage}%`, inline: false },
                    )
                    .setFooter({ text: leveledUp ? "¡Tu mascota ha subido de nivel!" : "Continúa explorando para ganar más experiencia." })
                    .setTimestamp();

                await interaction.followUp({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.followUp({ content: "❌ Ocurrió un error al completar la aventura.", ephemeral: true });
            }
        }, duration);
    },
};

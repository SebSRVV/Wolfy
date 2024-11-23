import {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
    Colors,
} from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "steal",
    description: "Roba estrellas enfrentándote a otro jugador en una batalla.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "oponente",
            description: "Elige al jugador al que quieres robar.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    async run(client, interaction) {
        const opponent = interaction.options.getUser("oponente");

        if (!opponent || opponent.id === interaction.user.id) {
            return interaction.reply({
                content: "❌ No puedes robarte a ti mismo. Elige a otro jugador como oponente.",
                ephemeral: true,
            });
        }

        const thief = await memberSchema.findOne({ "discord.id": interaction.user.id });
        const victim = await memberSchema.findOne({ "discord.id": opponent.id });

        if (!thief || !thief.pet) {
            return interaction.reply({
                content: "❌ No tienes una mascota para participar en el robo. Usa `/adopt` para adoptar una.",
                ephemeral: true,
            });
        }

        if (!victim || !victim.pet) {
            return interaction.reply({
                content: `❌ ${opponent.username} no tiene una mascota, por lo que no puedes robarle.`,
                ephemeral: true,
            });
        }

        const thiefPower =
            thief.pet.stats.health +
            thief.pet.stats.attack * 2 +
            thief.pet.stats.agility * 1.5 +
            thief.pet.stats.critChance +
            thief.pet.stats.critDamage;

        const victimPower =
            victim.pet.stats.health +
            victim.pet.stats.attack * 2 +
            victim.pet.stats.agility * 1.5 +
            victim.pet.stats.critChance +
            victim.pet.stats.critDamage;

        const victimStars = victim.money.economy.reduce((sum, entry) => sum + entry.amount, 0);

        if (victimStars <= 0) {
            return interaction.reply({
                content: `❌ ${opponent.username} no tiene estrellas para robar.`,
                ephemeral: true,
            });
        }

        const maxStealAmount = Math.min(victimStars, Math.floor(victimStars * 0.3)); // Hasta el 30% de las estrellas del oponente
        const stolenStars = Math.floor(Math.random() * maxStealAmount) + 1;

        const winner = thiefPower >= victimPower ? "thief" : "victim";

        if (winner === "thief") {
            // Restar estrellas al oponente y sumarlas al ladrón
            victim.money.economy.push({ amount: -stolenStars, reason: "Estrellas robadas", date: new Date() });
            thief.money.economy.push({ amount: stolenStars, reason: "Estrellas robadas", date: new Date() });
        }

        await thief.save();
        await victim.save();

        const embed = new EmbedBuilder()
            .setColor(winner === "thief" ? Colors.Green : Colors.Red)
            .setTitle(winner === "thief" ? "💰 Robo Exitoso" : "🚔 Robo Fallido")
            .setDescription(
                `⚔️ **Poder de tu mascota:** ${thiefPower.toFixed(2)}\n` +
                    `⚔️ **Poder de la mascota de ${opponent.username}:** ${victimPower.toFixed(2)}\n\n` +
                    (winner === "thief"
                        ? `🌟 **Estrellas robadas:** ${stolenStars}`
                        : "❌ Has fallado el robo. ¡Mejora tus estadísticas para tener más posibilidades!")
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "battle",
    description: "Reta a otro jugador en una batalla de mascotas.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "oponente",
            description: "Elige al jugador que deseas retar.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
    async run(client, interaction) {
        const opponent = interaction.options.getUser("oponente");

        if (opponent.id === interaction.user.id) {
            return interaction.reply({
                content: "No puedes retarte a ti mismo.",
                ephemeral: true,
            });
        }

        const player = await memberSchema.findOne({ "discord.id": interaction.user.id });
        const opponentData = await memberSchema.findOne({ "discord.id": opponent.id });

        if (!player?.pet || !opponentData?.pet) {
            return interaction.reply({
                content: "Ambos jugadores deben tener una mascota para participar en una batalla.",
                ephemeral: true,
            });
        }

        const playerPower = Math.floor(Math.random() * (player.pet.level * 10 + 20));
        const opponentPower = Math.floor(Math.random() * (opponentData.pet.level * 10 + 20));

        const winner = playerPower > opponentPower ? interaction.user : opponent;
        const winnerData = winner.id === interaction.user.id ? player : opponentData;

        winnerData.money.economy.push({ amount: 50, reason: "Victoria en batalla", date: new Date() });
        await winnerData.save();

        const embed = new EmbedBuilder()
            .setColor(0xffd700)
            .setTitle("⚔️ Batalla de Mascotas")
            .setDescription(
                `🎉 **¡${winner.username} ha ganado la batalla!**\n` +
                `🛡️ **Poder de ${interaction.user.username}:** ${playerPower}\n` +
                `🛡️ **Poder de ${opponent.username}:** ${opponentPower}`
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

import { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "skipto",
    description: "Salta a una canción específica en la cola.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "position",
            description: "Posición de la canción en la cola a la que deseas saltar.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1,
        },
    ],
    async run(client, interaction) {
        try {
            const player = client.manager.getPlayer(interaction.guild.id);

            if (!player || !player.queue.tracks || player.queue.tracks.length === 0) {
                return interaction.reply({
                    content: "No hay canciones en la cola para saltar.",
                    ephemeral: true,
                });
            }

            const position = interaction.options.getInteger("position", true) - 1; // Ajustar a índice basado en 0
            if (position < 0 || position >= player.queue.tracks.length) {
                return interaction.reply({
                    content: `Posición inválida. La cola tiene actualmente **${player.queue.tracks.length} canciones**.`,
                    ephemeral: true,
                });
            }

            // Remover las canciones hasta la posición especificada
            player.queue.tracks.splice(0, position);

            // Reproducir la nueva canción en la cola
            await player.skip();

            const embed = new EmbedBuilder()
                .setColor(0x1e90ff)
                .setTitle("⏭️ Canción Saltada")
                .setDescription(
                    `Saltado a la canción en la posición **${position + 1}**:\n` +
                        `**Título:** [${player.queue.current.info.title}](${player.queue.current.info.uri})\n` +
                        `**Autor:** ${player.queue.current.info.author}`
                )
                .setFooter({ text: "Disfruta de la música 🎶" })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "Ocurrió un error al intentar saltar a la canción especificada.",
                ephemeral: true,
            });
        }
    },
};

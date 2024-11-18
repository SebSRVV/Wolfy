import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "cola",
    description: "Muestra las canciones actualmente en la cola de reproducción.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        try {
            const player = client.manager.getPlayer(interaction.guild.id);

            if (!player || !player.queue.tracks || player.queue.tracks.length === 0) {
                return interaction.reply({
                    content: "No hay canciones en la cola actualmente.",
                    ephemeral: true,
                });
            }

            const currentTrack = player.queue.current;
            const queueTracks = player.queue.tracks;

            const embed = new EmbedBuilder()
                .setColor(0x1e90ff)
                .setTitle("🎵 Cola de Reproducción")
                .setDescription(
                    `**Reproduciendo Ahora:**\n` +
                        `[${currentTrack.info.title}](${currentTrack.info.uri}) - ${currentTrack.info.author}\n\n` +
                        "**Siguientes Canciones:**\n" +
                        queueTracks
                            .slice(0, 10) // Limitar a 10 canciones
                            .map(
                                (track, index) =>
                                    `\`${index + 1}.\` [${track.info.title}](${track.info.uri}) - ${track.info.author}`
                            )
                            .join("\n") +
                        (queueTracks.length > 10
                            ? `\n\n... y ${queueTracks.length - 10} canciones más.`
                            : "")
                )
                .setFooter({
                    text: `Total de canciones en cola: ${queueTracks.length + 1}`,
                })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "Ocurrió un error al intentar mostrar la cola de reproducción.",
                ephemeral: true,
            });
        }
    },
};

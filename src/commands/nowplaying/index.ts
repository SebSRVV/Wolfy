import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "nowplaying",
    description: "Muestra la canción que se está reproduciendo actualmente.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        try {
            const player = client.manager.getPlayer(interaction.guild.id);

            if (!player || !player.playing) {
                return interaction.reply({
                    content: "No hay ninguna canción reproduciéndose actualmente.",
                    ephemeral: true,
                });
            }

            const currentTrack = player.queue.current;

            if (!currentTrack) {
                return interaction.reply({
                    content: "No hay información disponible sobre la canción actual.",
                    ephemeral: true,
                });
            }

            const embed = new EmbedBuilder()
                .setColor(0x1e90ff)
                .setTitle("🎵 Reproduciendo Ahora")
                .setDescription(
                    `**Título:** [${currentTrack.info.title}](${currentTrack.info.uri})\n` +
                        `**Autor:** ${currentTrack.info.author}\n`
                )
                .setFooter({ text: "Disfruta tu música 🎶" })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "Ocurrió un error al intentar mostrar la canción actual.",
                ephemeral: true,
            });
        }
    },
};

// Helper Function to Format Duration
function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

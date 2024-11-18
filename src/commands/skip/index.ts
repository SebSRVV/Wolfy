import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "skip",
    description: "Salta la canción actualmente en reproducción.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        try {
            const player = client.manager.getPlayer(interaction.guild.id);

            if (!player || !player.queue.current) {
                return interaction.reply({
                    content: "No hay canciones en la cola para saltar.",
                    ephemeral: true,
                });
            }

            if (!player.playing) {
                return interaction.reply({
                    content: "No hay una canción reproduciéndose actualmente.",
                    ephemeral: true,
                });
            }

            const currentTrack = player.queue.current;

            await player.skip();

            const embed = new EmbedBuilder()
                .setColor(0xffa500)
                .setTitle("⏭️ Canción Saltada")
                .setDescription(
                    `**Canción Saltada:** [${currentTrack.info.title}](${currentTrack.info.uri})\n` +
                    `**Autor:** ${currentTrack.info.author}`
                )
                .setFooter({ text: "La siguiente canción comenzará pronto." })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "Ocurrió un error al intentar saltar la canción.",
                ephemeral: true,
            });
        }
    },
};

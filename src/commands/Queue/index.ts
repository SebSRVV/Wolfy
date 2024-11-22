import {
    ApplicationCommandType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} from "discord.js";
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

            const tracks = player.queue.tracks;
            const currentTrack = player.queue.current;

            const ITEMS_PER_PAGE = 10;
            const totalPages = Math.ceil(tracks.length / ITEMS_PER_PAGE);
            let currentPage = 0;

            const generateEmbed = (page: number) => {
                const start = page * ITEMS_PER_PAGE;
                const end = start + ITEMS_PER_PAGE;
                const tracksOnPage = tracks.slice(start, end);

                return new EmbedBuilder()
                    .setColor(0x1e90ff)
                    .setTitle("🎵 Cola de Reproducción")
                    .setDescription(
                        `**Reproduciendo Ahora:**\n` +
                            `[${currentTrack.info.title}](${currentTrack.info.uri}) - ${currentTrack.info.author}\n\n` +
                            "**Siguientes Canciones:**\n" +
                            tracksOnPage
                                .map(
                                    (track, index) =>
                                        `\`${start + index + 1}.\` [${track.info.title}](${track.info.uri}) - ${track.info.author}`
                                )
                                .join("\n")
                    )
                    .setFooter({
                        text: `Página ${page + 1} de ${totalPages} | Total de canciones: ${
                            tracks.length + 1
                        }`,
                    })
                    .setTimestamp();
            };

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("prev")
                    .setLabel("⬅️ Anterior")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId("next")
                    .setLabel("➡️ Siguiente")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === totalPages - 1)
            );

            const reply = await interaction.reply({
                embeds: [generateEmbed(currentPage)],
                components: [row],
                fetchReply: true,
            });

            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 60000, // 1 minuto de interacción
            });

            collector.on("collect", async (buttonInteraction) => {
                if (buttonInteraction.user.id !== interaction.user.id) {
                    return buttonInteraction.reply({
                        content: "Solo quien usó el comando puede interactuar con estos botones.",
                        ephemeral: true,
                    });
                }

                if (buttonInteraction.customId === "prev" && currentPage > 0) {
                    currentPage--;
                } else if (buttonInteraction.customId === "next" && currentPage < totalPages - 1) {
                    currentPage++;
                }

                await buttonInteraction.update({
                    embeds: [generateEmbed(currentPage)],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("prev")
                                .setLabel("⬅️ Anterior")
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 0),
                            new ButtonBuilder()
                                .setCustomId("next")
                                .setLabel("➡️ Siguiente")
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === totalPages - 1)
                        ),
                    ],
                });
            });

            collector.on("end", () => {
                interaction.editReply({
                    components: [],
                });
            });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "Ocurrió un error al intentar mostrar la cola de reproducción.",
                ephemeral: true,
            });
        }
    },
};

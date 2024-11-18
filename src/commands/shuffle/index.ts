import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "shuffle",
    description: "Mezcla las canciones en la cola de reproducción.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        try {
            const player = client.manager.getPlayer(interaction.guild.id);

            if (!player || !player.queue.tracks || player.queue.tracks.length < 2) {
                return interaction.reply({
                    content: "No hay suficientes canciones en la cola para mezclar.",
                    ephemeral: true,
                });
            }

            // Mezclar la cola (excluyendo la canción actual)
            const queueTracks = player.queue.tracks;
            for (let i = queueTracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [queueTracks[i], queueTracks[j]] = [queueTracks[j], queueTracks[i]];
            }

            const embed = new EmbedBuilder()
                .setColor(0x1e90ff)
                .setTitle("🔀 Canciones Mezcladas")
                .setDescription(
                    "La cola de reproducción ha sido mezclada con éxito. 🎶\n" +
                        "¡Disfruta de la música en un orden diferente!"
                )
                .setFooter({ text: "Usa /cola para ver la nueva cola." })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "Ocurrió un error al intentar mezclar la cola.",
                ephemeral: true,
            });
        }
    },
};

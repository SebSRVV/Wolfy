import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "stop",
    description: "Detiene la reproducción de música y limpia la cola.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        try {
            const player = client.manager.getPlayer(interaction.guild.id);

            if (!player) {
                return interaction.reply({
                    content: "No hay un reproductor activo en este servidor.",
                    ephemeral: true,
                });
            }

            player.queue.remove(0);
            player.disconnect();

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("🛑 Reproducción Detenida")
                .setDescription(
                    "La música ha sido detenida y la cola de reproducción ha sido limpiada."
                )
                .setFooter({ text: "Usa /play para empezar nuevamente 🎵" })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "Ocurrió un error al intentar detener la música.",
                ephemeral: true,
            });
        }
    },
};

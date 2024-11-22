import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "loop",
    description: "Activa o desactiva el modo loop para la canción actual o la cola.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "mode",
            description: "Elige el modo de loop (track, queue o off)",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "track", value: "track" },
                { name: "queue", value: "queue" },
                { name: "off", value: "off" }
            ],
        },
    ],
    async run(client, interaction) {
        try {
            const player = client.manager.getPlayer(interaction.guild.id);

            if (!player) {
                return interaction.reply({
                    content: "No hay ningún reproductor activo en este servidor.",
                    ephemeral: true,
                });
            }

            const mode = interaction.options.getString("mode");
            let responseMessage: string;

            switch (mode) {
                case "track":
                    player.queue.loop = "track"; // Activa el loop de la canción actual
                    responseMessage = "🔂 El modo loop para la **canción actual** está activado.";
                    break;
                case "queue":
                    player.queue.loop = "queue"; // Activa el loop para toda la cola
                    responseMessage = "🔁 El modo loop para la **cola de reproducción** está activado.";
                    break;
                case "off":
                    player.queue.loop = "off"; // Desactiva el loop
                    responseMessage = "⏹️ El modo loop está desactivado.";
                    break;
                default:
                    responseMessage = "⚠️ Modo de loop no válido. Usa `track`, `queue` o `off`.";
                    break;
            }

            const embed = new EmbedBuilder()
                .setColor(0x1e90ff)
                .setTitle("🎵 Modo Loop Actualizado")
                .setDescription(responseMessage)
                .setFooter({ text: "Usa el comando /loop para cambiar el modo nuevamente." })
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "Ocurrió un error al intentar cambiar el modo loop.",
                ephemeral: true,
            });
        }
    },
};

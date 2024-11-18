import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "volume",
    description: "Ajusta el volumen del reproductor.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "level",
            description: "Nivel de volumen [ 1-100 ].",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1,
            max_value: 100,
        },
    ],
    async run(client, interaction) {
        try {
            const volume = interaction.options.getInteger("level", true);
            const player = client.manager.getPlayer(interaction.guild.id);

            if (!player) {
                return interaction.reply({ content: "No hay un reproductor activo en este servidor.", ephemeral: true });
            }

            player.setVolume(volume);
            interaction.reply({ content: `🔊 Volumen ajustado a **${volume}%**.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Ocurrió un error al intentar ajustar el volumen.", ephemeral: true });
        }
    },
};

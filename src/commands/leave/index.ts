import { ApplicationCommandType } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { getVoiceConnection } from '@discordjs/voice';

export const command: CommandInterface = {
    name: "leave",
    description: "Deja el canal de voz en el que estoy.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        try {
            if (!interaction.guild) {
                return interaction.reply({ content: "Este comando solo se puede usar en un servidor.", ephemeral: true });
            }
            const connection = getVoiceConnection(interaction.guild.id);

            if (!connection) {
                return interaction.reply({ content: "No estoy en ningún canal de voz.", ephemeral: true });
            }

            connection.destroy();

            await interaction.reply({ content: "He dejado el canal de voz.", ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Ocurrió un error al intentar dejar el canal de voz.", ephemeral: true });
        }
    }
};

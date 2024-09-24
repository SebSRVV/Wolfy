import { ApplicationCommandType } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { joinVoiceChannel } from '@discordjs/voice'; 

export const command: CommandInterface = {
    name: "join",
    description: "Une el bot al canal de voz en el que estás.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        try {
            if (!interaction.guild) {
                return interaction.reply({ content: "Este comando solo se puede usar en un servidor.", ephemeral: true });
            }

            const member = interaction.member;

            if (!member || !('voice' in member)) {
                return interaction.reply({ content: "¡Debes estar en un canal de voz para que el bot se una!", ephemeral: true });
            }

            const voiceChannel = member.voice.channel;

            if (!voiceChannel) {
                return interaction.reply({ content: "¡Debes estar en un canal de voz para que el bot se una!", ephemeral: true });
            }

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            await interaction.reply({ content: `¡Me he unido a ${voiceChannel.name}!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Ocurrió un error al intentar unirme al canal de voz.", ephemeral: true });
        }
    }
};

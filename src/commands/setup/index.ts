import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, Colors, EmbedBuilder, TextChannel } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import setupSchema from "@/src/database/schemas/Setup"; 
import { Emojis } from "@/src/enums";

export const command: CommandInterface = {
    name: "setup",
    description: "Comando para definir un canal del bot.",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "canal",
        description: "Selecciona el canal de texto que quieres configurar para el bot.",
        type: ApplicationCommandOptionType.Channel,
        channel_types: [ChannelType.GuildText],
        required: true, 
    }],
    run: async (client, interaction) => {
        try {
            const channel = interaction.options.getChannel('canal') as TextChannel;

            if (!channel || channel.type !== ChannelType.GuildText) {
                return interaction.reply({ content: "Debes seleccionar un canal de texto válido.", ephemeral: true });
            }

            // Guardamos el canal en la base de datos
            await setupSchema.findOneAndUpdate(
                { guildId: interaction.guild?.id },
                { channelId: channel.id, updatedAt: new Date() },
                { upsert: true }
            );

            // Creamos un embed de respuesta
            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle("Configuración Completa")
                .setDescription(`El bot ha sido configurado para usar el canal: <#${channel.id}>`);

            // Enviamos un mensaje al canal configurado
            await channel.send({
                content: `${Emojis.SPARKLE} **Wolfy está listo para interactuar en este canal!**`
            });

            // Respuesta al usuario
            await interaction.reply({
                content: `${Emojis.SPARKLE} **Configuración completada!** El canal se ha configurado correctamente.`,
                embeds: [embed], 
                ephemeral: true 
            });
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                await interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
            } else {
                await interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
            }
        }
    }
};

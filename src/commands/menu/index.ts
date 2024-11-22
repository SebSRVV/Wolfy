import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Colors,
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "menu",
    description: "Genera un menú con botones para las actividades disponibles.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "channel",
            description: "Canal donde enviar el menú (opcional, se usará el canal actual si no se selecciona).",
            type: ApplicationCommandOptionType.Channel,
            required: false,
        },
    ],

    async run(client, interaction: ChatInputCommandInteraction) {
        try {
            // Obtener el canal seleccionado o usar el canal actual
            const selectedChannel = interaction.options.getChannel("channel") || interaction.channel;

            if (!selectedChannel?.isTextBased()) {
                return interaction.reply({
                    content: "Por favor selecciona un canal de texto válido.",
                    ephemeral: true,
                });
            }

            // Crear un embed para el menú
            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle("🎮 Menú de Actividades")
                .setDescription(
                    "Selecciona una actividad para empezar a jugar:\n\n" +
                        "🌍 **Aventura:** Explora y gana experiencia y recursos.\n" +
                        "⚔️ **Batalla:** Pelea contra otros jugadores o enemigos para ganar recompensas.\n" +
                        "🎣 **Pesca:** Consigue peces y recursos raros.\n" +
                        "🛡️ **Misiones:** Completa tareas para subir de nivel."
                )
                .setFooter({ text: "Selecciona una actividad usando los botones abajo." })
                .setTimestamp();

            // Crear los botones de actividades
            const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("adventure")
                    .setLabel("🌍 Aventura")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("battle")
                    .setLabel("⚔️ Batalla")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("fishing")
                    .setLabel("🎣 Pesca")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("missions")
                    .setLabel("🛡️ Misiones")
                    .setStyle(ButtonStyle.Secondary)
            );

            // Enviar el mensaje con el menú y botones
            await selectedChannel.send({ embeds: [embed], components: [buttons] });

            await interaction.reply({
                content: `El menú de actividades ha sido enviado a ${selectedChannel}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "Ocurrió un error al intentar generar el menú.",
                ephemeral: true,
            });
        }
    },
};

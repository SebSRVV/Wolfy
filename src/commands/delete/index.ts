import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    CategoryChannel,
    ChatInputCommandInteraction,
    TextChannel,
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "delete",
    description: "Elimina una categoría y todos sus canales.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "category",
            description: "Selecciona la categoría que deseas eliminar.",
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    async run(client, interaction: ChatInputCommandInteraction) {
        try {
            // Obtener la categoría seleccionada
            const category = interaction.options.getChannel("category") as CategoryChannel;

            // Validar que la categoría sea del tipo correcto
            if (!category || category.type !== 4) { // ChannelType.GuildCategory === 4
                return interaction.reply({
                    content: "Por favor, selecciona una categoría válida.",
                    ephemeral: true,
                });
            }

            // Confirmar la eliminación al usuario
            await interaction.reply({
                content: `Se está eliminando la categoría **${category.name}** y todos sus canales.`,
                ephemeral: true,
            });

            // Eliminar todos los canales dentro de la categoría
            const children = category.children.cache;
            for (const channel of children.values()) {
                await channel.delete("Eliminando todos los canales dentro de la categoría seleccionada.");
            }

            // Eliminar la categoría
            await category.delete("Eliminando la categoría seleccionada.");

            // Notificar al usuario que se completó
            await interaction.followUp({
                content: `La categoría **${category.name}** y todos sus canales han sido eliminados exitosamente.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                await interaction.editReply({ content: "Ocurrió un error al intentar eliminar la categoría." });
            } else {
                await interaction.reply({ content: "Ocurrió un error al intentar eliminar la categoría.", ephemeral: true });
            }
        }
    },
};

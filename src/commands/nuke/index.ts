import {
    ApplicationCommandType,
    PermissionFlagsBits,
    EmbedBuilder,
    Colors
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema from "@schemas/Member";

export const command: CommandInterface = {
    name: "nuke",
    description: "Elimina todas las mascotas de todos los usuarios sin excepción.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        // Verificar si el usuario tiene permisos de administrador
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: "No tienes permiso para usar este comando.",
                ephemeral: true,
            });
        }

        // Borrar todas las mascotas de todos los usuarios
        try {
            await memberSchema.updateMany({}, { $unset: { pet: "" } });

            // Embed de confirmación
            const nukeEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("💥 ¡Nuke Activado!")
                .setDescription("Todas las mascotas han sido eliminadas de todos los usuarios sin excepción.")
                .setFooter({ text: "Esta acción no se puede deshacer." })
                .setTimestamp();

            // Responder al usuario que ejecutó el comando
            await interaction.reply({ embeds: [nukeEmbed] });
        } catch (error) {
            console.error("Error al ejecutar el comando nuke:", error);

            // Enviar mensaje de error en caso de fallo
            await interaction.reply({
                content: "Ocurrió un error al intentar eliminar todas las mascotas.",
                ephemeral: true,
            });
        }
    },
};

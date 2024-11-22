import {
    ChatInputCommandInteraction,
    CategoryChannel,
    TextChannel,
} from "discord.js";
import memberSchema from "@/src/database/schemas/Member";
import { RankRoles } from "@/src/enums";

export const nukeMember = async (interaction: ChatInputCommandInteraction) => {
    try {
        // Obtener al usuario seleccionado
        const selected = interaction.options.getUser("user");
        if (!selected) return interaction.reply({ content: "Usuario no encontrado.", ephemeral: true });

        // Verificar si el usuario es un bot
        if (selected.bot) return interaction.reply({ content: "No puedes seleccionar bots.", ephemeral: true });

        // Buscar al miembro en la base de datos
        const user = await memberSchema.findOne({ "discord.id": selected.id });
        if (!user) return interaction.reply({ content: "El usuario no está registrado en la base de datos.", ephemeral: true });

        const member = await interaction.guild?.members.fetch(selected.id);
        if (!member) return interaction.reply({ content: "No se pudo encontrar al usuario en el servidor.", ephemeral: true });

        // Eliminar canales asociados
        const categoryChannelId = user.discord?.category;
        const textChannelId = user.discord?.channel;

        if (categoryChannelId) {
            const categoryChannel = interaction.guild?.channels.cache.get(categoryChannelId) as CategoryChannel;
            if (categoryChannel) {
                for (const channel of categoryChannel.children.cache.values()) {
                    await channel.delete("Eliminando todos los canales de la categoría del usuario.");
                }
                await categoryChannel.delete("Eliminando la categoría del usuario.");
            }
        }

        if (textChannelId) {
            const textChannel = interaction.guild?.channels.cache.get(textChannelId) as TextChannel;
            if (textChannel) {
                await textChannel.delete("Eliminando el canal de texto del usuario.");
            }
        }

        // Eliminar el miembro de la base de datos
        await memberSchema.findOneAndDelete({ "discord.id": selected.id });

        // Remover roles asociados
        const roleKey = user.rank.charAt(0).toUpperCase() + user.rank.slice(1);
        const roleID = RankRoles[roleKey as keyof typeof RankRoles];
        if (roleID) {
            await member.roles.remove(roleID).catch(() => {
                interaction.followUp({ content: "No se pudo remover el rol del usuario. Hazlo manualmente.", ephemeral: true });
            });
        }

        // Confirmar la eliminación
        interaction.reply({
            content: `✅ El miembro **${selected.username}** ha sido completamente eliminado.`,
            ephemeral: true,
        });
    } catch (error) {
        console.error(error);
        if (interaction.replied) {
            await interaction.editReply({ content: "Ocurrió un error al intentar eliminar al miembro." });
        } else {
            await interaction.reply({ content: "Ocurrió un error al intentar eliminar al miembro.", ephemeral: true });
        }
    }
};

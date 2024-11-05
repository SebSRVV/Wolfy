import memberSchema from "@/src/database/schemas/Member";
import { RankRoles } from "@/src/enums";
import { Client } from "@/src/lib/classes";
import { ChatInputCommandInteraction } from "discord.js";

const removeMember = async (client: Client, interaction: ChatInputCommandInteraction) => {
    try {
        const selected = interaction.options.getUser("user");
        if (!selected) return interaction.reply({ content: "Usuario no encontrado.", ephemeral: true });

        if (selected.bot) return interaction.reply({ content: "No puedes seleccionar bots.", ephemeral: true });

        const user = await memberSchema.findOne({ "discord.id": selected.id });
        if (!user) return interaction.reply({ content: "El usuario no existe.", ephemeral: true });

        const member = await interaction.guild?.members.fetch(selected.id);
        if (!member) return interaction.reply({ content: "No se pudo encontrar al usuario.", ephemeral: true });

        await memberSchema.findOneAndDelete({ "discord.id": selected.id });

        const roleKey = user.rank.charAt(0).toUpperCase() + user.rank.slice(1);
        const roleID = RankRoles[roleKey as keyof typeof RankRoles];
        if (!roleID) {
            return interaction.reply({
                content: "Rol inválido.",
                ephemeral: true
            });
        }

        const roleRemoved = await member.roles
            .remove(roleID)
            .then(() => true)
            .catch(() => false);

        if (!roleRemoved) {
            return interaction.reply({
                content: "No se pudo remover el rol. Por favor, hacerlo manualmente.",
                ephemeral: true
            });
        }

        interaction.reply({ content: "Usuario removido correctamente.", ephemeral: true });
    } catch (error) {
        console.error(error);
        if (interaction.replied) {
            await interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
        } else {
            await interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
        }
    }
};

export default removeMember;

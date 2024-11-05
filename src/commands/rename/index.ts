import {
    ApplicationCommandType,
    EmbedBuilder,
    Colors,
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema from "@schemas/Member";

export const command: CommandInterface = {
    name: "rename",
    description: "Cambia el nombre de tu mascota.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        const newName = interaction.options.getString("nombre"); // Obtener el nuevo nombre

        if (!newName || newName.length < 1 || newName.length > 20) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription("❌ El nombre debe tener entre 1 y 20 caracteres.")
                ],
                ephemeral: true,
            });
        }   

        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });
        if (!member || !member.pet) {
            return await interaction.reply({
                content: "No tienes una mascota que renombrar.",
                ephemeral: true,
            });
        }

        member.pet.name = newName; 
        await member.save(); 

        await interaction.reply({
            content: `🎉 ¡Has cambiado el nombre de tu mascota a **${newName}**!`,
            ephemeral: true,
        });
    }
};

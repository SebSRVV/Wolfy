import {
    ApplicationCommandType,
    EmbedBuilder,
    Colors,
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema from "@schemas/Member";

export const command: CommandInterface = {
    name: "abandon",
    description: "Abandona tu mascota actual.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });
        if (!member) {
            return await interaction.reply({
                content: "No tienes una cuenta registrada. Usa otro comando para registrarte.",
                ephemeral: true,
            });
        }


        if (!member.pet) {
            return await interaction.reply({
                content: "No tienes ninguna mascota para abandonar.",
                ephemeral: true,
            });
        }


        member.pet = null; 
        await member.save(); 

    
        await interaction.reply({
            content: `🚫 Has abandonado a tu mascota. ¡Buena suerte en tus futuras aventuras!`,
            ephemeral: true,
        });
    }
};

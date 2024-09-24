import { ApplicationCommandOptionType, ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import ollama from 'ollama';
import { cyan } from "colors";
import { set } from "mongoose";
import { Emojis } from "@/src/enums";

export const command: CommandInterface = {
    name: "talk",
    description: "Comando para conversar con el bot",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "texto",
        description: "Mensaje",
        type: ApplicationCommandOptionType.String,
        required: true, 
    }],
    run: async (client, interaction) => {
        try {
            const userMessage = interaction.options.getString('texto'); 


            const response = await ollama.generate({
                model: 'llama3', 
                prompt: `Actua y responde como una mascota virtual eres un lobo llamada Wolfy. Responde en español y en un maximo de 1500 caracteres. Responde de manera amigable y tierna en el mismo idioma de el siguiente mensaje: ."${userMessage}"`,
            });

            console.log("Respuesta del modelo:");
            console.log(response);
            const responseText = response?.response || "Wolfy no pudo generar una respuesta.";

            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setDescription(responseText); 

            await interaction.reply({
                content: `${Emojis.SPARKLE} **Respuesta de Wolfy:** `,
                embeds: [embed], 
                ephemeral: false 
            });
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
            } else {
                interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
            }
        }
    }
};

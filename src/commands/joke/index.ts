import { ApplicationCommandOptionType, ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import ollama from 'ollama';
import { Emojis } from "@/src/enums";

export const command: CommandInterface = {
    name: "joke",
    description: "Comando para que Wolfy te cuente un chiste",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "idioma",
        description: "El idioma en el que deseas el chiste",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
            { name: "Español", value: "es" },
            { name: "Inglés", value: "en" },
            { name: "Portugués", value: "pt" },
            { name: "Francés", value: "fr" },
            { name: "Japonés", value: "ja" },
        ],
    }],
    run: async (client, interaction) => {
        try {
            const idioma = interaction.options.getString('idioma'); 
            const languageName = idioma === "es" ? "español" :
                                 idioma === "en" ? "inglés" :
                                 idioma === "pt" ? "portugués" :
                                 idioma === "fr" ? "francés" : "japonés";
            
            const prompt = `Actúa como una mascota virtual, un lobo llamado Wolfy. Cuéntame un chiste en ${languageName}, asegurándote de que toda la respuesta esté en ese idioma.`;

            const response = await ollama.generate({
                model: 'llama3', 
                prompt: prompt,
            });

            console.log("Respuesta del modelo:", response);
            const responseText = response?.response || "Wolfy no pudo generar una respuesta.";

            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setDescription(responseText); 

            await interaction.reply({
                content: `${Emojis.SPARKLE} **Respuesta de Wolfy:**`,
                embeds: [embed], 
                ephemeral: false 
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

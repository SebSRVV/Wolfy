import { CommandInterface } from "@/src/types/Command";
import { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client } from "@lib/classes";

export const command: CommandInterface = {
    type: ApplicationCommandType.ChatInput,
    name: 'predictwolfynlp',
    description: 'Predice cómo se comportará Wolfy basado en un mensaje',
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'message',
            description: 'Mensaje para analizar',
            required: true
        }
    ],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const userMessage = interaction.options.getString('message', true);

        // Extraer características del mensaje con WolfyNLP
        const inputs = client.nlp.extractFeatures(userMessage);
        // Obtener predicción de Wolfy
        const prediction = client.wolfy.predict(inputs);
        const response = prediction === 1 ? "Wolfy actuará positivamente." : "Wolfy no responderá bien.";

        await interaction.reply(`Predicción: "${response}"`);
    }
};

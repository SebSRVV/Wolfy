// en desarollo
import { CommandInterface } from "@/src/types/Command";
import { ChatInputCommandInteraction } from "discord.js";
import talkTranslate, { getLanguageOptions } from "./talkTranslate";

const command: CommandInterface = {
    type: 1,
    name: "talk",
    description: "Interactúa con Wolfy",
    options: [
        {
            type: 3, // Tipo string
            name: "subcommand",
            description: "Elige un subcomando (translate, math, quote, define, natural, joke)",
            required: true,
            choices: [
                { name: "Translate", value: "translate" },
                { name: "Math", value: "math" },
                { name: "Quote", value: "quote" },
                { name: "Define", value: "define" },
                { name: "Natural", value: "natural" },
                { name: "Joke", value: "joke" }
            ]
        },
        {
            type: 3,
            name: "input",
            description: "Tu entrada para Wolfy",
            required: true
        },
        {
            type: 3, 
            name: "language",
            description: "Idioma de destino para la traducción",
            required: false,
            choices: getLanguageOptions() 
        }
    ],
    run: async (client, interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getString("subcommand");
        const userInput = interaction.options.getString("input");
        const language = interaction.options.getString("language") as "es" | "en"; 
        
        if (!userInput) {
            await interaction.reply("Por favor proporciona una entrada.");
            return;
        }

        try {
            switch (subcommand) {
                case "translate":
                    await talkTranslate(client, interaction, userInput, language);
                    break;
                case "math":
                    await import("./talkMath").then(module => module.default(client, interaction, userInput));
                    break;
                case "quote":
                    await import("./talkQuote").then(module => module.default(client, interaction));
                    break;
                case "define":
                    await import("./talkDefine").then(module => module.default(client, interaction, userInput));
                    break;
                case "natural":
                    await import("./talkNatural").then(module => module.default(client, interaction, userInput));
                    break;
                case "joke":
                    await import("./talkJoke").then(module => module.default(client, interaction));
                    break;
                default:
                    await interaction.reply("Comando no reconocido.");
                    break;
            }
        } catch (error) {
            console.error("Error en el comando 'talk':", error);
            await interaction.reply("Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.");
        }
    }
};

export { command };

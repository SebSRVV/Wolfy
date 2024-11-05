import {
    ApplicationCommandType,
    EmbedBuilder,
    Colors,
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import axios from "axios";

// Definir las opciones de idiomas
const languageChoices = [
    { name: "Inglés", value: "en" },
    { name: "Español", value: "es" },
    { name: "Francés", value: "fr" },
    { name: "Alemán", value: "de" },
    { name: "Italiano", value: "it" },
    { name: "Portugués", value: "pt" },
    { name: "Chino", value: "zh" },
    { name: "Japonés", value: "ja" },
    // Puedes añadir más idiomas aquí
];

export const command: CommandInterface = {
    name: "translate",
    description: "Traduce una palabra o frase a otro idioma.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "texto",
            description: "Texto que deseas traducir.",
            type: 3, // STRING
            required: true,
        },
        {
            name: "idioma",
            description: "Idioma al que deseas traducir (por defecto: español).",
            type: 3, // STRING
            required: false,
            choices: languageChoices,
        },
    ],

    async run(client, interaction) {
        const textToTranslate: string = interaction.options.getString("texto")!;
        const targetLanguage: string = interaction.options.getString("idioma") || "es"; // Por defecto es español

        try {
            // Realizar la solicitud a la API de LibreTranslate
            const response = await axios.post('https://libretranslate.de/translate', {
                q: textToTranslate,
                source: 'auto',
                target: targetLanguage,
                format: 'text'
            });

            const translatedText = response.data.translatedText;

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setTitle("🌍 Traducción")
                        .addFields(
                            { name: "Texto Original", value: textToTranslate },
                            { name: "Traducción", value: translatedText },
                        )
                ],
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription("❌ Ocurrió un error al traducir el texto. Inténtalo de nuevo.")
                ],
                ephemeral: true,
            });
        }
    }
};

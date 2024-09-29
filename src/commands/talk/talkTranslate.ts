import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import axios from "axios"; 

type Language = "es" | "en"; 

const talkTranslate = async (
    client: any, 
    interaction: ChatInputCommandInteraction, 
    inputText: string, 
    targetLanguage: Language 
) => {

    if (!inputText || inputText.trim().length === 0) {
        await interaction.reply("⚠️ **Error:** La entrada no puede estar vacía. Proporciona un texto para traducir.");
        return;
    }

    try {
        const translatedText = await translateText(inputText, targetLanguage);
        
        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("🌐 Traducción")
            .addFields(
                { name: "Texto original", value: inputText, inline: false },
                { name: "Traducción", value: translatedText, inline: false }
            )
            .setFooter({ text: "Traducción realizada por Wolfy" });

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error("Error al traducir el texto:", error);
        await interaction.reply("⚠️ **Error:** Ocurrió un problema al procesar tu solicitud. Inténtalo de nuevo más tarde.");
    }
};

const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
    const url = "https://libretranslate.de/translate"; 

    try {
        const response = await axios.post(url, {
            q: text,
            source: targetLanguage === 'es' ? 'en' : 'es', 
            format: "text"
        });

        if (response.data && response.data.translatedText) {
            return response.data.translatedText;
        } else {
            throw new Error("Error en la respuesta de traducción");
        }
    } catch (error) {
        console.error("Error en la llamada a la API de traducción:", error);
        throw new Error("No se pudo completar la traducción"); 
    }
};


export function getLanguageOptions() {
    return [
        { name: "Español", value: "es" },
        { name: "Inglés", value: "en" },
    ];
}

export default talkTranslate;

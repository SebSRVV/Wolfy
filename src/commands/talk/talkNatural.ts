import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { WolfyNLP } from "@/src/lib/wolfynlp"; 
import { WolfyMLP } from "@/src/lib/wolfymlp"; 
import ResponseModel from "@/src/database/schemas/Responses"; 

const wolfyNLP = new WolfyNLP();
const mlp = new WolfyMLP([5, 3, 1]); 

const natural = async (client: any, interaction: ChatInputCommandInteraction, input: string) => {
    if (!input || input.trim().length === 0) {
        await interaction.reply("⚠️ **Error:** La entrada no puede estar vacía. Proporciona un texto para analizar.");
        return;
    }

    try {
        const features = wolfyNLP.extractFeatures(input);
        const sentimentAnalysis = wolfyNLP.analyzeSentiment(input);
        const entities = wolfyNLP.extractEntities(input);
        const language = "es"; 
        

        const inputFeatures = [
            features[0], 
            features[1], 
            sentimentAnalysis.score, 
            features[4], 
            features[5]  
        ];

        
        const mlpPrediction = mlp.predict(inputFeatures);


        const botResponse = await wolfyNLP.generateResponse(input, language);

        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("🐾 Análisis Natural de Wolfy")
            .setDescription("Aquí tienes el análisis del texto proporcionado:")
            .addFields(
                { name: "📊 Características del Texto:", value: `
                    - **Número de palabras:** ${features[0]}
                    - **Palabras largas (más de 3 letras):** ${features[1]}
                    - **Contiene la palabra 'bueno':** ${features[2] ? '✅ Sí' : '❌ No'}
                    - **Puntuación de sentimiento:** ${sentimentAnalysis.score} (${interpretSentiment(sentimentAnalysis.score)})
                    - **Longitud promedio de palabras:** ${features[4].toFixed(2)}
                    - **Longitud promedio de oraciones:** ${features[5].toFixed(2)}
                `, inline: false },
                { name: "🧠 Entidades Extraídas:", value: `${entities.length > 0 ? entities.join(', ') : 'Ninguna'}`, inline: false },
                { name: "✨ Respuesta de Wolfy:", value: botResponse, inline: false },
                { name: "🔮 Predicción MLP:", value: `La predicción del MLP es: ${mlpPrediction.toFixed(2)}`, inline: false }
            )
            .setFooter({ text: "🐾 Análisis realizado por tu mascota virtual, Wolfy!" });

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error("Error al procesar el análisis natural:", error);
        await interaction.reply("⚠️ **Error:** Ocurrió un problema al procesar tu solicitud. Inténtalo de nuevo más tarde.");
    }
};

function interpretSentiment(score: number): string {
    if (score > 0) return "😊 Positivo";
    else if (score < 0) return "😢 Negativo";
    else return "😐 Neutral";
}

export default natural;

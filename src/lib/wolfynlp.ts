import Sentiment from 'sentiment';
import compromise from 'compromise';
import ResponseModel from "@/src/database/schemas/Responses"; 

export class WolfyNLP {
    private sentimentAnalyzer: Sentiment;

    constructor() {
        this.sentimentAnalyzer = new Sentiment();
    }

    public async generateResponse(input: string, language: 'es' | 'en'): Promise<string> {
        const lowerInput = input.toLowerCase();

        // Verificar en la base de datos con el idioma
        const customResponse = await ResponseModel.findOne({ trigger: lowerInput, language });
        if (customResponse) {
            return customResponse.response;
        }

        // Respuestas predeterminadas
        return this.defaultResponses(lowerInput, language);
    }

    private defaultResponses(input: string, language: 'es' | 'en'): string {
        const insultWords = ['tonto', 'idiota', 'tonta', 'malo']; 
        const hasInsult = insultWords.some(word => input.includes(word));

        if (hasInsult) {
            return language === 'es' ? "Por favor, mantén un lenguaje respetuoso. 💔" : "Please, keep the language respectful. 💔";
        }

        const responses = {
            es: {
                hello: "¡Hola! ¿Cómo puedo ayudarte hoy?",
                thanks: "¡De nada! Estoy aquí para ayudar.",
                goodbye: "¡Hasta luego! Espero verte de nuevo.",
                default: "No estoy seguro de cómo responder a eso. Pero puedo ayudarte con análisis de texto y más. Puedes enseñarme con el comando /teach.",
            },
            en: {
                hello: "Hello! How can I assist you today?",
                thanks: "You're welcome! I'm here to help.",
                goodbye: "Goodbye! I hope to see you again.",
                default: "I'm not sure how to respond to that. But I can help with text analysis and more. You can teach me using the /teach command.",
            }
        };

        // Comprobar palabras específicas
        if (input.includes('hola')) return responses.es.hello;
        if (input.includes('gracias')) return responses.es.thanks;
        if (input.includes('adiós')) return responses.es.goodbye;
        if (input.includes('hello')) return responses.en.hello;
        if (input.includes('thank you')) return responses.en.thanks;
        if (input.includes('goodbye')) return responses.en.goodbye;

        return responses[language].default; // Devolver la respuesta predeterminada según el idioma
    }

    public analyzeSentiment(message: string) {
        return this.sentimentAnalyzer.analyze(message);
    }

    public extractEntities(message: string): string[] {
        const doc = compromise(message);
        return doc.topics().out('array');
    }

    public extractFeatures(message: string): number[] {
        const words = message.split(/\s+/);
        const feature1 = words.length; // Número de palabras
        const feature2 = words.filter(word => word.length > 3).length; // Palabras largas
        const feature3 = words.includes("bueno") ? 1 : 0; // Contiene "bueno"
        const sentimentAnalysis = this.analyzeSentiment(message);
        const feature4 = sentimentAnalysis.score; // Puntuación de sentimiento
        const feature5 = this.averageWordLength(words); // Longitud promedio de palabras
        const feature6 = this.averageSentenceLength(message); // Longitud promedio de oraciones
        const entities = this.extractEntities(message);

        return [
            feature1,
            feature2,
            feature3,
            feature4,
            feature5,
            feature6
        ];
    }

    private averageWordLength(words: string[]): number {
        if (words.length === 0) return 0;
        const totalLength = words.reduce((acc, word) => acc + word.length, 0);
        return totalLength / words.length;
    }

    private averageSentenceLength(message: string): number {
        const sentences = message.split(/[.!?]/).filter(Boolean);
        if (sentences.length === 0) return 0;
        const totalLength = sentences.reduce((acc, sentence) => acc + sentence.split(" ").length, 0);
        return totalLength / sentences.length;
    }
}

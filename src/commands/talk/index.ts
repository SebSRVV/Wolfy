import { ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import * as tf from "@tensorflow/tfjs-node";
import path from "path";

let model: tf.LayersModel | null = null;

// Función para cargar el modelo
const loadModel = async () => {
    if (!model) {
        const modelPath = path.resolve(__dirname, "../../models/model.json"); // Ruta del modelo
        model = await tf.loadLayersModel(`file://${modelPath}`);
        console.log("Modelo cargado exitosamente.");
    }
};

// Función para preprocesar la entrada del usuario
const preprocessInput = (message: string): { input_1: tf.Tensor; input_2: tf.Tensor } => {
    const maxSequenceLength = 30; // Longitud máxima esperada por el modelo

    // Crear dos entradas separadas para simular las dos entradas del modelo
    const inputArray1 = Array(maxSequenceLength).fill(0); // Rellenar con ceros
    const inputArray2 = Array(maxSequenceLength).fill(0);

    // Convertir caracteres del mensaje en valores numéricos simulados
    const messageTokens = message.split("").map((char) => char.charCodeAt(0) % 1000);
    for (let i = 0; i < Math.min(messageTokens.length, maxSequenceLength); i++) {
        inputArray1[i] = messageTokens[i];
        inputArray2[i] = (messageTokens[i] + 1) % 1000; // Diferencia simulada para la segunda entrada
    }

    // Retornar ambos tensores con las formas adecuadas
    return {
        input_1: tf.tensor([inputArray1], [1, maxSequenceLength]), // [batch_size, max_sequence_length]
        input_2: tf.tensor([inputArray2], [1, maxSequenceLength]), // [batch_size, max_sequence_length]
    };
};

// Función para postprocesar la salida del modelo
const postprocessOutput = (output: tf.Tensor): string => {
    const predictions = output.dataSync(); // Obtener los valores de salida
    const topPrediction = predictions.indexOf(Math.max(...predictions)); // Índice de la mayor probabilidad
    return `El modelo predice: ${topPrediction}`;
};

export const command: CommandInterface = {
    name: "talk",
    description: "Genera una respuesta usando el modelo de IA.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "message",
            description: "El mensaje que quieres enviar al modelo.",
            type: 3, // Tipo STRING
            required: true, // Es obligatorio
        },
    ],

    async run(client, interaction) {
        try {
            const message = interaction.options.getString("message");
            if (!message) {
                return interaction.reply({
                    content: "Por favor, proporciona un mensaje.",
                    ephemeral: true,
                });
            }

            // Cargar el modelo si no está cargado
            await loadModel();

            if (!model) {
                return interaction.reply({
                    content: "El modelo no está disponible en este momento.",
                    ephemeral: true,
                });
            }

            // Preprocesar la entrada
            const inputTensors = preprocessInput(message);

            // Generar la predicción
            const outputTensor = model.predict([inputTensors.input_1, inputTensors.input_2]) as tf.Tensor;
            const response = postprocessOutput(outputTensor);

            // Crear el embed para mostrar la respuesta
            const embed = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle("**Respuesta del Modelo**")
                .setDescription(
                    `📩 **Mensaje enviado:**\n${message}\n\n🤖 **Respuesta generada:**\n${response}`
                )
                .setFooter({ text: "Modelo AI" })
                .setTimestamp();

            // Enviar el embed
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                await interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
            } else {
                await interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
            }
        }
    },
};

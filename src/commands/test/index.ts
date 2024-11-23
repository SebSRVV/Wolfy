import { ApplicationCommandType } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import * as tf from "@tensorflow/tfjs-node";
import path from "path";

let model: tf.LayersModel | null = null;

// Función para cargar el modelo
const loadModel = async () => {
    if (!model) {
        const modelPath = path.resolve(__dirname, "../../models/model.json"); // Ruta al modelo
        model = await tf.loadLayersModel(`file://${modelPath}`);
        console.log("Modelo cargado exitosamente.");
    }
};

// Generar entradas simuladas para ambos inputs del modelo
const generateTestInputs = (): tf.Tensor[] => {
    const maxSequenceLength = 30;

    // Crear tensores simulados para cada input del modelo
    const input1 = tf.tensor2d([Array(maxSequenceLength).fill(1)], [1, maxSequenceLength]); // Primer input
    const input2 = tf.tensor2d([Array(maxSequenceLength).fill(2)], [1, maxSequenceLength]); // Segundo input

    return [input1, input2];
};

// Procesar la salida del modelo
const processTestOutput = (output: tf.Tensor): string => {
    const predictions = output.dataSync(); // Obtener datos de salida como un array
    const topPrediction = predictions.indexOf(Math.max(...predictions)); // Obtener índice con mayor probabilidad
    return `La clase predicha es: ${topPrediction}`;
};

export const command: CommandInterface = {
    name: "test",
    description: "Prueba el modelo cargado y verifica que esté funcionando.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        try {
            await interaction.deferReply(); // Indicar que la respuesta será diferida

            // Cargar el modelo si no está cargado
            await loadModel();

            if (!model) {
                return interaction.editReply("❌ El modelo no se pudo cargar.");
            }

            // Generar entradas simuladas para el modelo
            const [input1, input2] = generateTestInputs();

            // Realizar predicción (asegurarse de pasar las entradas correctamente como un array)
            const prediction = model.predict([input1, input2]) as tf.Tensor;

            // Procesar la salida del modelo
            const result = processTestOutput(prediction);

            // Enviar el resultado al usuario
            await interaction.editReply(`✅ **Resultado del modelo:** ${result}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply("❌ Ocurrió un error al probar el modelo.");
        }
    },
};

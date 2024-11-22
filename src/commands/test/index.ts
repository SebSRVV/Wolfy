import { ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import * as tf from "@tensorflow/tfjs-node";
import path from "path";

let model: tf.LayersModel | null = null;

// Cargar el modelo
const loadModel = async () => {
    if (!model) {
        const modelPath = path.resolve(__dirname, "../../models/model.json"); // Ruta al modelo
        model = await tf.loadLayersModel(`file://${modelPath}`);
        console.log("Modelo cargado exitosamente.");
    }
};

// Generar entradas simuladas
const generateTestInputs = (): { input_1: tf.Tensor; input_2: tf.Tensor } => {
    const maxSequenceLength = 30; // Longitud máxima
    const inputArray1 = Array(maxSequenceLength).fill(1); // Valores simulados para input_1
    const inputArray2 = Array(maxSequenceLength).fill(2); // Valores simulados para input_2

    return {
        input_1: tf.tensor([inputArray1], [1, maxSequenceLength]), // Tensor para input_1
        input_2: tf.tensor([inputArray2], [1, maxSequenceLength]), // Tensor para input_2
    };
};

// Procesar la salida del modelo
const processTestOutput = (output: tf.Tensor): string => {
    const predictions = output.dataSync(); // Obtener las predicciones
    const topPrediction = predictions.indexOf(Math.max(...predictions)); // Índice con mayor probabilidad
    return `La predicción más alta corresponde al índice: ${topPrediction}`;
};

export const command: CommandInterface = {
    name: "test",
    description: "Prueba el modelo cargado y verifica que esté funcionando.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        try {
            // Cargar el modelo si no está cargado
            await loadModel();

            if (!model) {
                return interaction.reply({
                    content: "El modelo no está disponible en este momento.",
                    ephemeral: true,
                });
            }

            // Generar entradas simuladas
            const testInputs = generateTestInputs();

            // Realizar la predicción
            const testOutput = model.predict([testInputs.input_1, testInputs.input_2]) as tf.Tensor;

            // Procesar la salida
            const result = processTestOutput(testOutput);

            // Crear embed de respuesta
            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle("**Prueba del Modelo**")
                .setDescription(
                    `✅ El modelo fue cargado exitosamente y generó una predicción:\n${result}`
                )
                .setFooter({ text: "Prueba de Modelo" })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                await interaction.editReply({
                    content: "❌ Ocurrió un error al probar el modelo.",
                });
            } else {
                await interaction.reply({
                    content: "❌ Ocurrió un error al probar el modelo.",
                    ephemeral: true,
                });
            }
        }
    },
};

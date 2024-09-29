// src/commands/teach.ts
import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import ResponseModel from "@/src/database/schemas/Responses"; 

export const command = {
    name: "teach",
    description: "Enseña a Wolfy a responder a un mensaje específico.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "mensaje",
            description: "El mensaje que deseas que Wolfy aprenda.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "respuesta",
            description: "La respuesta que debe dar Wolfy.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "idioma",
            description: "El idioma de la respuesta (es para español, en para inglés).",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "Español", value: "es" },
                { name: "Inglés", value: "en" }
            ]
        }
    ],
    async run(client: any, interaction: ChatInputCommandInteraction) {
        const message = interaction.options.getString("mensaje");
        const response = interaction.options.getString("respuesta");
        const language = interaction.options.getString("idioma");

        try {
            if (!message || !response || !language) {
                await interaction.reply({ content: "⚠️ **Error:** Todos los campos son obligatorios.", ephemeral: true });
                return;
            }

            const existingResponse = await ResponseModel.findOne({ trigger: message, language });
            if (existingResponse) {
                existingResponse.response = response;
                await existingResponse.save();
                await interaction.reply({ content: "✅ Respuesta actualizada.", ephemeral: true });
            } else {
                const newResponse = new ResponseModel({ trigger: message, response, language });
                await newResponse.save();
                await interaction.reply({ content: "🎉 Wolfy ha aprendido una nueva respuesta.", ephemeral: true });
            }
        } catch (error) {
            console.error("Error al enseñar a Wolfy:", error);
            await interaction.reply({ content: "⚠️ **Error:** Ocurrió un error al enseñar a Wolfy. Intenta de nuevo más tarde.", ephemeral: true });
        }
    }
};

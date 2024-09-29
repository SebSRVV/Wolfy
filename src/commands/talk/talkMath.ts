// src/commands/talkMath.ts
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { create, all } from 'mathjs';

const math = async (client: any, interaction: ChatInputCommandInteraction, expression: string) => {
    const math = create(all);
    
    try {

        if (!expression || expression.trim().length === 0) {
            await interaction.reply("⚠️ **Error:** Proporciona una expresión matemática válida.");
            return;
        }

        const result = math.evaluate(expression);
        
        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("🧮 Resultado de la Evaluación Matemática")
            .setDescription("Aquí tienes el resultado de tu expresión:")
            .addFields(
                { name: "🔍 Expresión:", value: `\`${expression}\``, inline: false },
                { name: "✅ Resultado:", value: `\`${result.toString()}\``, inline: false }
            )
            .setFooter({ text: "Calculado por Wolfy", iconURL: client.user?.avatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error("Error al evaluar la expresión matemática:", error);
        await interaction.reply("⚠️ **Error:** Ocurrió un problema al procesar tu expresión matemática. Asegúrate de que esté escrita correctamente.");
    }
};

export default math;

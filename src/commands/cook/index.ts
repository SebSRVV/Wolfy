import { ApplicationCommandType, EmbedBuilder, Colors } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "cook",
    description: "Cocina para mejorar las habilidades de tu mascota.",
    type: ApplicationCommandType.ChatInput,
    async run(client, interaction) {
        const userId = interaction.user.id;
        const member = await memberSchema.findOne({ "discord.id": userId });

        if (!member || !member.pet) {
            return interaction.reply({
                content: "No tienes una mascota o recursos para cocinar.",
                ephemeral: true,
            });
        }

        const cookingRecipes = [
            { dish: "🍖 Carne Asada", boost: "Fuerza", value: 15 },
            { dish: "🥗 Ensalada", boost: "Agilidad", value: 10 },
            { dish: "🍞 Pan Energético", boost: "Resistencia", value: 20 },
        ];
        const selectedDish = cookingRecipes[Math.floor(Math.random() * cookingRecipes.length)];

        member.pet[selectedDish.boost.toLowerCase()] += selectedDish.value;
        await member.save();

        const embed = new EmbedBuilder()
            .setColor(Colors.Yellow)
            .setTitle("🍳 Cocinando")
            .setDescription(
                `🍴 **Platillo Cocinado:** ${selectedDish.dish}\n` +
                `✨ **Beneficio:** +${selectedDish.value} ${selectedDish.boost}`
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

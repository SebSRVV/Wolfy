import { ApplicationCommandType, EmbedBuilder, Colors } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
    name: "abandon",
    description: "Abandona tu mascota actual.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });

        if (!member || !member.pet) {
            return interaction.reply({
                content: "❌ No tienes una mascota que abandonar. Usa `/adopt` para conseguir una.",
                ephemeral: true,
            });
        }

        const abandonedPet = member.pet;
        member.pet = null; // Remover la mascota
        await member.save();

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle("💔 Has abandonado a tu mascota")
            .setDescription(
                `Tu mascota **${abandonedPet.name}** (${abandonedPet.type.charAt(0).toUpperCase() + abandonedPet.type.slice(1)}) ha sido abandonada.\n` +
                "Esperamos que encuentres una nueva mascota pronto."
            )
            .setFooter({ text: "Puedes adoptar otra mascota con el comando /adopt." })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

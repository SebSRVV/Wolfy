import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, Colors } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";
import { PetTypes } from "@/src/enums";

export const command: CommandInterface = {
    name: "adopt",
    description: "Adopta una nueva mascota.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "nombre",
            description: "Elige un nombre para tu nueva mascota.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "tipo",
            description: "Elige el tipo de mascota que deseas adoptar.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: Object.values(PetTypes).map((type) => ({
                name: type.charAt(0).toUpperCase() + type.slice(1),
                value: type,
            })),
        },
    ],

    async run(client, interaction) {
        const name = interaction.options.getString("nombre")!;
        const type = interaction.options.getString("tipo")!;

        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });

        if (member && member.pet) {
            return interaction.reply({
                content: "❌ Ya tienes una mascota. Usa `/abandon` para abandonar tu mascota actual antes de adoptar otra.",
                ephemeral: true,
            });
        }

        const newPet = {
            name,
            type,
            rarity: "common", // Raridad básica al adoptar
            level: 1,
            xp: 0,
            feed: 0,
            starsEarned: 0,
            time: new Date(),
        };

        if (!member) {
            // Crear un nuevo usuario con la mascota
            await memberSchema.create({
                discord: { id: interaction.user.id, username: interaction.user.username },
                money: { economy: [], food: [] },
                logs: [],
                rank: "novice",
                hide: false,
                pet: newPet,
            });
        } else {
            // Agregar la mascota al miembro existente
            member.pet = newPet;
            await member.save();
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("🐾 ¡Felicidades por tu nueva mascota!")
            .setDescription(
                `¡Has adoptado un **${type.charAt(0).toUpperCase() + type.slice(1)}** llamado **${name}**.\n` +
                `Cuida bien de tu mascota y ayúdala a crecer.`)
            .addFields(
                { name: "🌟 Rareza", value: "Común", inline: true },
                { name: "⚡ Nivel", value: "1", inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

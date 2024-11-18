import {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
    Colors
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema from "@schemas/Member";

export const command: CommandInterface = {
    name: "rename",
    description: "Cambia el nombre de tu mascota.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "nuevo_nombre",
            description: "El nuevo nombre que deseas ponerle a tu mascota.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    async run(client, interaction) {
        const newName = interaction.options.getString("nuevo_nombre");

        // Verificar que el nombre cumpla con ciertos requisitos (por ejemplo, longitud máxima)
        if (!newName || newName.length < 2 || newName.length > 20) {
            const nameErrorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("❌ Nombre no válido")
                .setDescription("El nombre debe tener entre 2 y 20 caracteres.")
                .setFooter({ text: "Por favor, intenta nuevamente con un nombre válido." })
                .setTimestamp();

            return await interaction.reply({ embeds: [nameErrorEmbed], ephemeral: true });
        }

        // Buscar el miembro en la base de datos
        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });

        if (!member) {
            const noAccountEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("❌ ¡Sin Cuenta Registrada!")
                .setDescription("No tienes una cuenta registrada. Usa el comando de registro primero.")
                .setFooter({ text: "¡Regístrate para empezar a adoptar!" })
                .setTimestamp();

            return await interaction.reply({ embeds: [noAccountEmbed], ephemeral: true });
        }

        if (!member.pet) {
            const noPetEmbed = new EmbedBuilder()
                .setColor(Colors.Yellow)
                .setTitle("🐾 ¡Sin Mascota Adoptada!")
                .setDescription("No tienes una mascota adoptada. Usa el comando de adopción para conseguir una.")
                .setFooter({ text: "¡Adopta a una mascota y empieza la aventura!" })
                .setTimestamp();

            return await interaction.reply({ embeds: [noPetEmbed], ephemeral: true });
        }

        // Asegurarse de que `name` no es null o undefined antes de la asignación
        member.pet.name = newName ?? "Mascota"; // Usa "Mascota" como nombre predeterminado si newName es null o undefined
        await member.save();

        // Confirmar el cambio al usuario
        const successEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("✅ ¡Nombre Cambiado!")
            .setDescription(`El nombre de tu mascota ha sido cambiado exitosamente a **${newName}**.`)
            .setFooter({ text: "¡Disfruta de tu aventura con tu mascota!" })
            .setTimestamp();

        await interaction.reply({ embeds: [successEmbed] });
    }
};

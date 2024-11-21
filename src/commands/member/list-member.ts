import { ChatInputCommandInteraction, EmbedBuilder, Colors } from "discord.js";
import memberSchema from "@/src/database/schemas/Member";

export const listMember = async (interaction: ChatInputCommandInteraction) => {
    try {
        // Obtener todos los miembros registrados en la base de datos
        const members = await memberSchema.find();

        if (!members || members.length === 0) {
            return interaction.reply({
                content: "No hay miembros registrados en la base de datos.",
                ephemeral: true,
            });
        }

        // Crear un embed para mostrar la lista de miembros
        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle("📜 Lista de Miembros Registrados")
            .setDescription("Aquí tienes la lista de todos los miembros registrados.")
            .setFooter({ text: `Total de miembros: ${members.length}` })
            .setTimestamp();

        // Manejo de paginación (máximo 10 miembros por embed)
        const MAX_MEMBERS_PER_EMBED = 10;
        const pages: EmbedBuilder[] = [];
        let currentEmbed = new EmbedBuilder(embed.data);

        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            currentEmbed.addFields({
                name: `${i + 1}. ${member.discord.username}`,
                value: `**ID:** ${member.discord.id}\n**Rango:** ${member.rank}\n**Mascota:** ${
                    member.pet?.name || "Ninguna"
                }`,
                inline: false,
            });

            // Si se llena el embed o es el último miembro, guardar la página y crear una nueva
            if ((i + 1) % MAX_MEMBERS_PER_EMBED === 0 || i === members.length - 1) {
                pages.push(currentEmbed);
                currentEmbed = new EmbedBuilder(embed.data);
            }
        }

        // Si solo hay una página
        if (pages.length === 1) {
            return interaction.reply({ embeds: [pages[0]] });
        }

        // Paginación para múltiples páginas
        let currentIndex = 0;
        const message = await interaction.reply({
            embeds: [pages[currentIndex]],
            fetchReply: true,
        });

        await message.react("⬅️");
        await message.react("➡️");

        const collector = message.createReactionCollector({
            filter: (reaction, user) =>
                ["⬅️", "➡️"].includes(reaction.emoji.name!) && user.id === interaction.user.id,
            time: 60000, // 60 segundos
        });

        collector.on("collect", async (reaction) => {
            if (reaction.emoji.name === "⬅️" && currentIndex > 0) {
                currentIndex--;
            } else if (reaction.emoji.name === "➡️" && currentIndex < pages.length - 1) {
                currentIndex++;
            }

            await message.edit({ embeds: [pages[currentIndex]] });
            await reaction.users.remove(interaction.user.id); // Remover la reacción del usuario
        });

        collector.on("end", () => {
            message.reactions.removeAll().catch(() => null); // Eliminar las reacciones cuando termine
        });
    } catch (error) {
        console.error(error);
        interaction.reply({
            content: "Ocurrió un error al intentar obtener la lista de miembros.",
            ephemeral: true,
        });
    }
};

import {
    ApplicationCommandType,
    EmbedBuilder,
    Colors
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { shopItems } from "@/src/utils/items";

export const command: CommandInterface = {
    name: "shop",
    description: "Muestra los ítems disponibles en la tienda para comprar.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        try {
            // Dividir los ítems en categorías para organizarlos
            const categories = shopItems.reduce((acc, item) => {
                if (!acc[item.type]) acc[item.type] = [];
                acc[item.type].push(item);
                return acc;
            }, {} as { [key: string]: typeof shopItems });

            const embed = new EmbedBuilder()
                .setColor(Colors.Gold)
                .setTitle("🛒 Tienda de Ítems")
                .setDescription(
                    "Explora los ítems disponibles y compra el que desees usando `/buy <id>`.\n" +
                    "Cada ítem mejora las estadísticas de tu mascota. ¡Elige sabiamente!"
                )
                .setFooter({ text: "Usa /buy <id> para comprar un ítem." })
                .setTimestamp();

            // Agregar categorías al embed
            for (const [category, items] of Object.entries(categories)) {
                const itemsList = items
                    .map(
                        item =>
                            `**#${item.id} ${item.name}**\n` +
                            `   - 🏷️ **Descripción:** ${item.description}\n` +
                            `   - 💎 **Rareza:** ${item.rarity.toUpperCase()}\n` +
                            `   - 📊 **Efecto:** ${item.effect}\n` +
                            `   - 💰 **Precio:** ${item.price} estrellas\n`
                    )
                    .join("\n");

                embed.addFields({
                    name: `🛡️ ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                    value: itemsList,
                    inline: false,
                });
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error al mostrar la tienda:", error);
            await interaction.reply({
                content: "❌ Hubo un error al intentar mostrar la tienda. Por favor, intenta más tarde.",
                ephemeral: true,
            });
        }
    },
};

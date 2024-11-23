import { ApplicationCommandOptionType, ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema from "@schemas/Member";
import { shopItems } from "@/src/utils/items";

export const command: CommandInterface = {
    name: "buy",
    description: "Compra un ítem de la tienda para mejorar las estadísticas de tu mascota.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "id",
            description: "El ID del ítem que deseas comprar.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],

    async run(client, interaction) {
        try {
            const itemId = interaction.options.getInteger("id", true);

            // Buscar al usuario en la base de datos
            const member = await memberSchema.findOne({ "discord.id": interaction.user.id });

            if (!member) {
                return interaction.reply({
                    content: "❌ No tienes una cuenta registrada. Usa `/adopt` para adoptar una mascota primero.",
                    ephemeral: true,
                });
            }

            if (!member.pet) {
                return interaction.reply({
                    content: "❌ No tienes una mascota para equiparle un ítem. Usa `/adopt` para adoptar una.",
                    ephemeral: true,
                });
            }

            // Buscar el ítem en la tienda
            const itemToBuy = shopItems.find(item => item.id === itemId);

            if (!itemToBuy) {
                return interaction.reply({
                    content: `❌ No se encontró un ítem con el ID **${itemId}** en la tienda.`,
                    ephemeral: true,
                });
            }

            // Verificar si el usuario tiene suficientes estrellas
            const totalStars = member.money.economy.reduce((sum, entry) => sum + entry.amount, 0);
            if (totalStars < itemToBuy.price) {
                return interaction.reply({
                    content: `❌ No tienes suficientes estrellas para comprar **${itemToBuy.name}**. Te faltan **${
                        itemToBuy.price - totalStars
                    } estrellas**.`,
                    ephemeral: true,
                });
            }

            // Restar el precio del ítem del total de estrellas del usuario
            member.money.economy[0].amount -= itemToBuy.price;

            // Agregar el ítem a la mascota
            member.pet.items.push({
                id: itemToBuy.id,
                name: itemToBuy.name,
                description: itemToBuy.description,
                effect: itemToBuy.effect,
                rarity: itemToBuy.rarity as "common" | "rare" | "epic" | "legendary", // Corregido el tipo
                stats: itemToBuy.stats,
                type: itemToBuy.type,
            });

            // Actualizar las estadísticas de la mascota
            const petStats = member.pet.stats;
            const statsImproved: string[] = [];
            for (const [stat, value] of Object.entries(itemToBuy.stats || {}) as [keyof typeof petStats, number][]) {
                if (value && petStats[stat] !== undefined) {
                    petStats[stat] += value;
                    statsImproved.push(`**${stat.charAt(0).toUpperCase() + stat.slice(1)}**: +${value}`);
                }
            }

            await member.save();

            // Crear el embed para confirmar la compra
            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle("✅ Compra Exitosa")
                .setDescription(`Has comprado el ítem **${itemToBuy.name}** y se ha añadido a tu inventario.`)
                .addFields(
                    { name: "🏷️ Nombre", value: itemToBuy.name, inline: true },
                    { name: "💎 Rareza", value: itemToBuy.rarity.toUpperCase(), inline: true },
                    { name: "📊 Mejoras", value: statsImproved.join("\n"), inline: false },
                    {
                        name: "📈 Nuevas Estadísticas",
                        value: `❤️ **Vida**: ${petStats.health}\n🛡️ **Escudo**: ${petStats.shield}\n⚔️ **Ataque**: ${petStats.attack}\n⚡ **Agilidad**: ${petStats.agility}\n🔥 **Prob. Crítica**: ${petStats.critChance}%\n💥 **Daño Crítico**: ${petStats.critDamage}%`,
                        inline: false,
                    }
                )
                .setFooter({ text: "¡Sigue comprando para mejorar tu mascota!" })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error al comprar un ítem:", error);
            await interaction.reply({
                content: "❌ Hubo un error al intentar realizar la compra. Por favor, inténtalo más tarde.",
                ephemeral: true,
            });
        }
    },
};

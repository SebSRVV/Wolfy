import {
    ApplicationCommandType,
    EmbedBuilder,
    Colors
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema from "@schemas/Member";
import { MemberRanks } from "@schemas/Member";

export const command: CommandInterface = {
    name: "info",
    description: "Muestra información completa de tu mascota, estadísticas y objetos equipados.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
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

        // Información del usuario y mascota con valores predeterminados
        const {
            name = "Sin Nombre",
            type = "desconocido",
            rarity = "common",
            level = 1,
            xp = 0,
            feed = 0,
            starsEarned = 0,
            stats = {
                health: 100,
                shield: 10,
                attack: 5,
                agility: 1,
                critChance: 5,
                critDamage: 20,
            },
            items = [],
        } = member.pet;

        const rank = member.rank || MemberRanks.Novice;

        // Estadísticas base con valores predeterminados
        const baseStats = {
            health: stats.health ?? 100,
            shield: stats.shield ?? 10,
            attack: stats.attack ?? 5,
            agility: stats.agility ?? 1,
            critChance: stats.critChance ?? 5,
            critDamage: stats.critDamage ?? 20,
        };

        // Calcular estadísticas totales (base + ítems)
        const totalStats = { ...baseStats };
        items.forEach(item => {
            if (item.stats) {
                for (const [stat, value] of Object.entries(item.stats)) {
                    totalStats[stat as keyof typeof totalStats] =
                        (totalStats[stat as keyof typeof totalStats] || 0) + value;
                }
            }
        });

        // Lista de ítems
        const itemsDisplay = items.length
            ? items
                  .map(
                      item =>
                          `**• ${item.name}** (${item.rarity.toUpperCase()}):\n   - ${item.effect}`
                  )
                  .join("\n")
            : "Ningún objeto equipado.";

        // Calcular progreso de experiencia hacia el próximo nivel
        const xpNeededForNextLevel = 100 + level * 50;
        const progressPercentage = ((xp / xpNeededForNextLevel) * 100).toFixed(2);

        // Iconos y formato
        const rarityIcons: { [key: string]: string } = {
            common: "🟢",
            rare: "🔵",
            epic: "🟣",
            legendary: "🟡",
        };

        const petTypeIcons: { [key: string]: string } = {
            wolf: "🐺",
            dog: "🐶",
            cat: "🐱",
            rabbit: "🐰",
            bird: "🐦",
            dragon: "🐉",
            fox: "🦊",
            desconocido: "❓",
        };

        const rarityDisplay = `${rarityIcons[rarity] || "⚪"} ${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`;
        const typeDisplay = `${petTypeIcons[type] || "❓"} ${type.charAt(0).toUpperCase() + type.slice(1)}`;

        // Crear embed horizontal
        const infoEmbed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(`✨ Información de ${name}`)
            .setThumbnail(interaction.user.displayAvatarURL({  }))
            .setDescription(
                `Aquí tienes los detalles más importantes sobre **${name}**, tu fiel compañero.\n\n` +
                `💡 **Cuida de tu mascota para mejorar sus estadísticas y desbloquear recompensas exclusivas.**`
            )
            .addFields(
                // Primera fila: Información básica
                {
                    name: "🏷️ Nombre",
                    value: name,
                    inline: true,
                },
                {
                    name: "🦮 Tipo",
                    value: typeDisplay,
                    inline: true,
                },
                {
                    name: "🌟 Rareza",
                    value: rarityDisplay,
                    inline: true,
                },

                // Segunda fila: Nivel y progreso
                {
                    name: "⚡ Nivel",
                    value: `${level}`,
                    inline: true,
                },
                {
                    name: "🔹 XP",
                    value: `${xp}/${xpNeededForNextLevel} (${progressPercentage}%)`,
                    inline: true,
                },
                {
                    name: "💎 Rango",
                    value: rank,
                    inline: true,
                },

                // Estadísticas Totales
                {
                    name: "📊 Estadísticas Totales",
                    value:
                        `❤️ Vida: ${totalStats.health}\n` +
                        `🛡️ Escudo: ${totalStats.shield}\n` +
                        `⚔️ Ataque: ${totalStats.attack}\n` +
                        `⚡ Agilidad: ${totalStats.agility} ataques/s\n` +
                        `🔥 Prob Crit: ${totalStats.critChance}%\n` +
                        `💥 Crit DMG: ${totalStats.critDamage}%`,
                    inline: false,
                },

                // Lista de ítems
                {
                    name: "🎒 Inventario de Ítems",
                    value: itemsDisplay,
                    inline: false,
                }
            )
            .setFooter({
                text: "¡Sigue cuidando de tu mascota y mejora tus estadísticas!",
            })
            .setTimestamp();

        await interaction.reply({ embeds: [infoEmbed] });
    },
};

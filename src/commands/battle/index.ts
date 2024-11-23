import { ApplicationCommandType, EmbedBuilder, Colors } from "discord.js";
import memberSchema from "@schemas/Member";
import { CommandInterface } from "@/src/types/Command";

const monsters = [
    { name: "Slime", rarity: "common", health: 50, attack: 5, defense: 2 },
    { name: "Goblin", rarity: "common", health: 60, attack: 7, defense: 3 },
    { name: "Wild Boar", rarity: "common", health: 70, attack: 6, defense: 4 },
    { name: "Zombie", rarity: "common", health: 80, attack: 6, defense: 5 },
    { name: "Bandit", rarity: "common", health: 65, attack: 8, defense: 2 },
    { name: "Orc", rarity: "rare", health: 120, attack: 15, defense: 10 },
    { name: "Werewolf", rarity: "rare", health: 140, attack: 18, defense: 12 },
    { name: "Giant Spider", rarity: "rare", health: 110, attack: 12, defense: 8 },
    { name: "Cursed Knight", rarity: "rare", health: 130, attack: 17, defense: 13 },
    { name: "Ice Elemental", rarity: "rare", health: 125, attack: 16, defense: 12 },
    { name: "Fire Drake", rarity: "epic", health: 200, attack: 25, defense: 18 },
    { name: "Shadow Assassin", rarity: "epic", health: 180, attack: 28, defense: 15 },
    { name: "Stone Golem", rarity: "epic", health: 250, attack: 20, defense: 25 },
    { name: "Dark Sorcerer", rarity: "epic", health: 190, attack: 30, defense: 12 },
    { name: "Thunder Phoenix", rarity: "epic", health: 210, attack: 27, defense: 20 },
    { name: "Ancient Dragon", rarity: "legendary", health: 400, attack: 50, defense: 35 },
    { name: "Demon Lord", rarity: "legendary", health: 350, attack: 45, defense: 30 },
    { name: "Titan", rarity: "legendary", health: 500, attack: 40, defense: 50 },
    { name: "Archangel", rarity: "legendary", health: 300, attack: 55, defense: 25 },
    { name: "Leviathan", rarity: "legendary", health: 450, attack: 47, defense: 40 },
];


export const command: CommandInterface = {
    name: "battle",
    description: "Pelea contra un monstruo aleatorio y gana recompensas.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });

        if (!member || !member.pet) {
            return interaction.reply({
                content: "❌ No tienes una mascota para luchar. Usa `/adopt` para adoptar una.",
                ephemeral: true,
            });
        }

        // Seleccionar un monstruo aleatorio
        const monster = monsters[Math.floor(Math.random() * monsters.length)];

        // Estadísticas del jugador
        const petStats = member.pet.stats || { health: 0, attack: 0, agility: 0, critChance: 0, critDamage: 0 };
        const petPower =
            petStats.health +
            petStats.attack * 2 +
            petStats.agility * 1.5 +
            petStats.critChance +
            petStats.critDamage;

        // Estadísticas del monstruo
        const monsterPower = monster.health + monster.attack * 2 + monster.defense;

        // Determinar el ganador
        const winner = petPower >= monsterPower ? "pet" : "monster";
        const earnedStars = winner === "pet" ? Math.floor(Math.random() * 50) + 10 : 0;
        const earnedXp = winner === "pet" ? Math.floor(Math.random() * 30) + 10 : 0;

        if (winner === "pet") {
            // Actualizar recompensas del jugador
            member.money.economy.push({ amount: earnedStars, reason: "Victoria en batalla", date: new Date() });
            member.pet.xp += earnedXp;

            // Subir de nivel si se alcanza el XP necesario
            if (member.pet.xp >= 100) {
                member.pet.level += 1;
                member.pet.xp -= 100;
            }

            await member.save();
        }

        // Crear mensaje de resultado
        const embed = new EmbedBuilder()
            .setColor(winner === "pet" ? Colors.Green : Colors.Red)
            .setTitle(winner === "pet" ? "🎉 ¡Has Ganado!" : "💀 Derrota")
            .setDescription(
                `Te enfrentaste a un **${monster.name}** (${monster.rarity.toUpperCase()})\n\n` +
                    `⚔️ **Poder de tu mascota:** ${petPower.toFixed(2)}\n` +
                    `⚔️ **Poder del monstruo:** ${monsterPower.toFixed(2)}\n\n` +
                    (winner === "pet"
                        ? `🌟 **Recompensas:**\n- ⭐ Estrellas: ${earnedStars}\n- ⚡ Experiencia: ${earnedXp}`
                        : "💔 Has perdido. ¡Mejora tus estadísticas y vuelve a intentarlo!")
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

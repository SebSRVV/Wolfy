// import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, Colors, User } from "discord.js";
// import { CommandInterface } from "@/src/types/Command";

// const userXPData: Record<string, number> = {}; 

// export const command: CommandInterface = {
//     name: "xp",
//     description: "Ver los puntos de experiencia (XP) de un usuario.",
//     type: ApplicationCommandType.ChatInput,
//     options: [
//         {
//             name: "usuario",
//             description: "Usuario del que deseas ver el XP",
//             type: ApplicationCommandOptionType.User,
//             required: true,
//         },
//     ],
//     run: async (client, interaction) => {
//         const user = interaction.options.getUser('usuario');
        
//         // Obtener XP del usuario o inicializar en 0
//         const xp = userXPData[user.id] || 0;

//         const embed = new EmbedBuilder()
//             .setColor(Colors.Blue)
//             .setTitle(`🌟 XP de Wolfy - ${user.username}`)
//             .setDescription(`Aquí están los puntos de experiencia acumulados:`)
//             .addFields(
//                 { name: "🌕 XP Total", value: `**${xp}**`, inline: true },
//                 { name: "🐺 Rango", value: getWolfyRank(xp), inline: true },
//                 { name: "📅 Última actualización", value: `${new Date().toLocaleDateString()}`, inline: true }
//             )
//             .setFooter({ text: `Consulta la XP de otros usuarios con /xp @usuario` })
//             .setTimestamp();

//         await interaction.reply({ embeds: [embed] });
//     }
// };

// // Función para determinar el rango de Wolfy según la cantidad de XP
// function getWolfyRank(xp: number): string {
//     if (xp < 100) return "🐾 Cachorro de Wolfy";
//     if (xp < 300) return "🦊 Lobo Aprendiz";
//     if (xp < 600) return "🌕 Lobo Medio";
//     if (xp < 900) return "🐺 Lobo Feroz";
//     if (xp < 1200) return "🌟 Gran Lobo";
//     return "🌌 Lobo Legendario";
// }

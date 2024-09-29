import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, Colors, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { Emojis, PriorityUpgrade, RankRoles } from "@/src/enums";

import memberSchema, { MemberRanks } from "@schemas/Member";
import { UserPermission } from "@/src/enums/UserPermission";
import { rankHigher } from "@/src/utils/CalculatePriority";

export const command: CommandInterface = {
    name: "rank",
    description: "Cambia de prioridad a un usuario.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: UserPermission.ADMINISTRATOR,
    options: [
        {
            name: "miembro",
            description: "Usuario al que se le quiere cambiar la prioridad.",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
        {
            name: "prioridad",
            description: "Rol al que se quiere cambiar.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: Object.keys(RankRoles).map(role => ({
                name: role,
                value: RankRoles[role as keyof typeof RankRoles]
            }))
        }
    ],
    async run(client, interaction) {
        try {
            const miembro = interaction.options.getString("miembro");
            const roleID = interaction.options.getString("prioridad") as string;

            if (!miembro)
                return interaction.reply({
                    content: "Debes especificar un miembro.",
                    ephemeral: true
                });
            if (!roleID)
                return interaction.reply({
                    content: "Debes especificar un rol.",
                    ephemeral: true
                });

            const user = await memberSchema.findOne({ "discord.id": miembro });
            if (!user)
                return interaction.reply({
                    content: "No se pudo encontrar al usuario.",
                    ephemeral: true
                });

            const member = await interaction.guild?.members.fetch(miembro);
            if (!member)
                return interaction.reply({
                    content: "No se pudo encontrar al usuario.",
                    ephemeral: true
                });

            const roleKey = (user.rank.charAt(0).toUpperCase() + user.rank.slice(1)) as any;
            const role2ID = RankRoles[roleKey as keyof typeof RankRoles];
            if (!role2ID)
                return interaction.reply({
                    content: "Rol inválido.",
                    ephemeral: true
                });

            if (roleID === role2ID) return interaction.reply({ content: "El usuario ya tiene ese rol.", ephemeral: true });

            const rank = Object.keys(RankRoles)
                .find(key => RankRoles[key as keyof typeof RankRoles] === roleID)
                ?.toLowerCase() as MemberRanks;
            if (!rank)
                return interaction.reply({
                    content: "Rol inválido.",
                    ephemeral: true
                });

            let embed = null;

            const whosHigher = rankHigher(user.rank as any, rank as any);
            const embedData = {
                [PriorityUpgrade.Upgrade]: {
                    color: Colors.Green,
                    description: `${Emojis.Arrow} <@${miembro}> ascendió a <@&${roleID}> ${Emojis.Up}`
                },
                [PriorityUpgrade.Downgrade]: {
                    color: Colors.Red,
                    description: `${Emojis.Arrow} <@${miembro}> descendió a <@&${roleID}> ${Emojis.Down}`
                },
                [PriorityUpgrade.Neutral]: {
                    color: Colors.Aqua,
                    description: `${Emojis.Arrow} <@${miembro}> se te asignó <@&${roleID}>`
                }
            }[whosHigher];
            
            if (embedData) {
                embed = new EmbedBuilder()
                    .setColor(embedData.color)
                    .setDescription(embedData.description);
            }

            if (!embed) return interaction.reply({ content: "No se pudo cambiar el rango.", ephemeral: true });

            const notifyChannel = await client.channels
                .fetch("1288840139698737184")
                .then(c => c)
                .catch(() => null);
            if (!notifyChannel) return interaction.reply({ content: "No se pudo cambiar el rango.", ephemeral: true });

            if (notifyChannel.type !== ChannelType.GuildText)
                return interaction.reply({ content: "No se pudo cambiar el rango.", ephemeral: true });

            await notifyChannel.send({ embeds: [embed] });

            const roleRemoved = await member.roles
                .remove(role2ID)
                .then(() => true)
                .catch(() => false);
            if (!roleRemoved)
                return interaction.reply({
                    content: "No se pudo remover el rol. Por favor, hacerlo manualmente.",
                    ephemeral: true
                });

            user.rank = rank;

            if (rank === MemberRanks.Novice) user.hide = true;
            else user.hide = false;

            await user.save();

            await member.roles.add(roleID);

            interaction.reply({
                content: "Rango cambiado exitosamente.",
                ephemeral: true
            });
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
            } else {
                interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
            }
        }
    }
};

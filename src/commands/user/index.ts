import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import addMember from "./add-member";
import removeMember from "./remove-member";
import hideMember from "./hide-member";
import editMember from "./edit-member";
import { MemberRanks } from "@/src/database/schemas/Member";
import { UserPermission } from "@/src/enums/UserPermission";

export const command: CommandInterface = {
	name: "member",
	description: "Configurar los miembros",
	type: ApplicationCommandType.ChatInput,
	default_member_permissions: UserPermission.ADMINISTRATOR,
	options: [
		{
			name: "add",
			description: "Añadir un miembro",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "user",
					description: "Usuario a añadir",
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: "rank",
					description: "Rango del miembro",
					type: ApplicationCommandOptionType.String,
					required: true,
					choices: Object.values(MemberRanks).map(rank => ({
						name: rank.charAt(0).toUpperCase() + rank.slice(1),
						value: rank
					}))
				},
				{
					name: "category",
					description: "Categoria a añadir (si no tiene una se le creara una automaticamente)",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildCategory],
					required: false
				},
				{
					name: "channel",
					description: "Canal donde se escribiran los mensajes (si no tiene uno se le creara automaticamente)",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildText],
					required: false
				}
			]
		},
		{
			name: "edit",
			description: "Editar un miembro",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "user",
					description: "Usuario a editar",
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: "category",
					description: "Categoria a editar",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildCategory],
					required: true
				},
				{
					name: "channel",
					description: "Canal a editar",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildText],
					required: true
				}
			]
		},
		{
			name: "remove",
			description: "Remover un miembro",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "user",
					description: "Usuario a remover",
					type: ApplicationCommandOptionType.User,
					required: true
				}
			]
		},
		{
			name: "hide",
			description: "Ocultar un miembro",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "user",
					description: "Usuario a ocultar",
					type: ApplicationCommandOptionType.User,
					required: true
				}
			]
		}
	],

	async run(client, interaction) {
		try {
			const subcommand = interaction.options.getSubcommand();

			if (subcommand === "add") addMember(client, interaction);
			else if (subcommand === "edit") editMember(client, interaction);
			else if (subcommand === "remove") removeMember(client, interaction);
			else if (subcommand === "hide") hideMember(client, interaction);
			else
				interaction.reply({
					content: "Subcomando no encontrado.",
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

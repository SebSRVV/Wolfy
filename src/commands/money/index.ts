import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

import addMoney from "./add-money";
import removeMoney from "./remove-money";
import tipMoney from "./tip-money";
import balanceMoney from "./balance-money";
import { UserPermission } from "@/src/enums/UserPermission";
import availableMoney from "./available-money";
import historyMoney from "./history-money";

export const command: CommandInterface = {
	name: "money",
	description: "Configurar las ordenes",
	type: ApplicationCommandType.ChatInput,
	default_member_permissions: UserPermission.ADMINISTRATOR,
	options: [
		{
			name: "add",
			description: "Agregar dinero a un usuario",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "miembro",
					description: "Usuario al que se le agregará el dinero",
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true
				},
				{
					name: "monto",
					description: "Cantidad de dinero a agregar",
					type: ApplicationCommandOptionType.Number,
					required: true,
					min_value: 0
				}
			]
		},
		{
			name: "remove",
			description: "Remover dinero a un usuario",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "miembro",
					description: "Usuario al que se le removerá el dinero",
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true
				},
				{
					name: "monto",
					description: "Cantidad de dinero a remover",
					type: ApplicationCommandOptionType.Number,
					required: true,
					min_value: 0
				}
			]
		},
		{
			name: "tip",
			description: "Dar propina a un usuario",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "miembro",
					description: "Usuario al que se le dará la propina",
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true
				},
				{
					name: "order",
					description: "ID de la orden",
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true
				},
				{
					name: "monto",
					description: "Cantidad de dinero a dar",
					type: ApplicationCommandOptionType.Number,
					required: true,
					min_value: 0
				}
			]
		},
		{
			name: "history",
			description: "Ver el historial de dinero de un usuario",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "miembro",
					description: "Usuario al que se le verá el historial",
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true
				},
				{
					name: "filter",
					description: "Filtro de historial",
					type: ApplicationCommandOptionType.String,
					required: false,
					choices: [
						{
							name: "Available",
							value: "available"
						},
						{
							name: "Hold",
							value: "hold"
						}
					]
				}
			]
		},
		{
			name: "balance",
			description: "Ver el balance de un usuario",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "miembro",
					description: "Usuario al que se le verá el balance",
					type: ApplicationCommandOptionType.String,
					required: false,
					autocomplete: true
				}
			]
		},
		{
			name: "available",
			description: "Muestra el monto total de dinero en available",
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: "admin",
			description: "Balance administrativo",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "owner",
					description: "Usuario al que se le verá el balance",
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true
				},
				{
					name: "miembro",
					description: "Usuario al que se le verá el balance",
					type: ApplicationCommandOptionType.String,
					autocomplete: true
				},
			]
		},
		{
			name: "pending",
			description: "Muestra el monto total de dinero en available",
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: "hold",
			description: "Muestra el monto total de dinero en hold",
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: "real",
			description: "Ver el balance real de un usuario",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "miembro",
					description: "Usuario al que se le verá el balance",
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true
				}
			]
		}
	],

	async run(client, interaction) {
		try {
			const subcommand = interaction.options.getSubcommand();

			if (subcommand === "add") addMoney(client, interaction);
			else if (subcommand === "remove") removeMoney(client, interaction);
			else if (subcommand === "tip") tipMoney(client, interaction);
			else if (subcommand === "balance") balanceMoney(client, interaction);
			else if (subcommand === "history") historyMoney(client, interaction);
			else if (subcommand === "available") availableMoney(client, interaction);
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

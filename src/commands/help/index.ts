import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { Emojis} from "@/src/enums";

export const command: CommandInterface = {
	name: "help",
	description: "Muestra todos los comandos",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "command",
			description: "Muestra información de un comando específico",
			type: ApplicationCommandOptionType.String,
			required: false
		}
	],
	async run(client, interaction) {
		try {
			if (!client.commands) return interaction.reply({ content: "No hay comandos registrados.", ephemeral: true });

			const commands = client.commands.map(command => {
				return {
					name: command.name,
					description: command.description,
					subcommands: command.options
						?.filter(option => option.type === ApplicationCommandOptionType.Subcommand)
						.map(subcommand => ({
							name: subcommand.name,
							description: subcommand.description
						})) || []
				};
			});

			const embed = new EmbedBuilder()
				.setTitle("Lista de Comandos:")
				.setDescription("Aquí tienes la lista de comandos disponibles:")
				.setColor(0xFFFF00);  

			const fields = commands.map(command => {
				let commandDescription = `${Emojis.Arrow} **${command.name}**: ${command.description}`;
				if (command.subcommands.length) {
					const subcommandsList = command.subcommands .map(subcommand => `${Emojis.Arrow} \`${subcommand.name}:\` ${subcommand.description}`)
					.join("\n")
					commandDescription += `\n${subcommandsList}`;
				}

				return { name: command.name, value: commandDescription };
			});

			embed.addFields(fields);

			interaction.reply({ embeds: [embed], ephemeral: true });
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

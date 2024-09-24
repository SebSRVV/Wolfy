import { ChannelType, Colors, EmbedBuilder } from "discord.js";
import { EventInterface } from "@/src/types/Event";
import { CommandInterface } from "@/src/types/Command";
import { AutocompleteInterface } from "../types/Autocomplete";
// import memberModel, { IUser } from "@schemas/Member";
// import { SelectmenusInterface } from "../types/Selectmenus";
// import { ButtonInterface } from "../types/Button";

export const event: EventInterface = {
	name: "interactionCreate",
	run: async (client, interaction) => {
		console.debug([`/${interaction?.commandName}`, interaction.user.username]);

		if (interaction.isCommand()) {
			try {
				if (!interaction.guild)
					return interaction.reply({
						content: "Este comando solo se puede realizar en un servidor.",
						ephemeral: true
					});

				const command = client.commands?.get(interaction.commandName) as CommandInterface;

				if (!command) {
					console.error(`Command ${interaction.commandName} not found`);
					throw new Error(`Command ${interaction.commandName} not found`);
				}

				if (command.permissions) {
					//check if the bot has the required permissions in the guild to run the command
					const botMember = interaction.guild.members.cache.get(process.env.DISCORD_CLIENT_ID);
					if (!botMember)
						return interaction.reply({
							content: "Ouh Nouh! Un Error ocurrio mientras intentabas realizar el comando.",
							ephemeral: true
						});

					const arrayOfRolePerms = [] as any;
					const arrayOfChannelPerms = [] as any;
					let checkChannel = false;

					const subcommandName = interaction.options.getSubcommand();

					const botPermissions = botMember.permissions;
					const requiredPermissions = command.permissions[subcommandName]?.perms;
					if (requiredPermissions) {
						const requiredChannelPermissions = command.permissions[subcommandName].channel;
						if (requiredChannelPermissions) checkChannel = true;

						botPermissions.missing(requiredPermissions).forEach((permission: any) => {
							arrayOfRolePerms.push(permission);

							if (
								checkChannel &&
								interaction?.channel?.type === ChannelType.GuildText &&
								!interaction.channel.permissionsFor(botMember)?.has(permission)
							) {
								arrayOfChannelPerms.push(permission);
							}
						});

						if (arrayOfRolePerms.length) {
							const noPermissionEmbed = new EmbedBuilder()
								.setColor(Colors.Red)
								.setTitle(`No permissions`)
								.setDescription(`I don't have the required permissions to run this command.`)
								.addFields([
									{
										name: `Permissions missing:`,
										value: `\`\`\`${arrayOfRolePerms.join(", ")}\`\`\``
									}
								])
								.setFooter({
									text: `${interaction.user.username}`,
									iconURL: interaction.user.displayAvatarURL()
								})
								.setTimestamp();

							if (arrayOfChannelPerms.length) {
								noPermissionEmbed.addFields([
									{
										name: `Channel permissions missing:`,
										value: `\`\`\`${arrayOfChannelPerms.join(", ")}\`\`\``
									}
								]);
							}

							interaction.reply({
								embeds: [noPermissionEmbed],
								ephemeral: true
							});

							// return (botNoPerms = true);
							return;
						}
					}
				}

				await command.run(client, interaction);
			} catch (error) {
				console.error(error);
				return interaction.reply({
					content: "Un error ocurrió mientras se procesaba el comando.",
					ephemeral: true
				});
			}
			} else if (interaction.isAutocomplete()) {
				try {

					if (!interaction.guild)
						return interaction.respond([
							{
								name: "This command can only be used in a server.",
								value: "server"
							}
						]);
				const command = client.autocomplete?.get(interaction.commandName) as AutocompleteInterface;
				if (!command) {
					console.error(`Command ${interaction.commandName} not found`);
					throw new Error(`Command ${interaction.commandName} not found`);
				}

					await command.run(client, interaction);
				} catch (error) {
					console.error(error);
					return interaction.respond([]);
				}
			} 
			// else if (interaction.isStringSelectMenu()) {
			// 	try {
			// 		if (!interaction.guild)
			// 			return interaction.reply({
			// 				content: "This command can only be used in a server.",
			// 				ephemeral: true
			// 			});
			// 		const command = client.selectmenus?.get(interaction.customId.split("_")[0]) as SelectmenusInterface;
			// 		if (!command) {
			// 			console.error(`Command ${interaction.customId} not found`);
			// 			throw new Error(`Command ${interaction.customId} not found`);
			// 		}

			// 		await command.run(client, interaction);
			// 	} catch (error) {
			// 		console.error(error);
			// 		return interaction.respond([]);
			// 	}
			// } else if (interaction.isButton()) {
			// 	try {
			// 		const command = client.buttons?.get(interaction.customId.split("_")[0]) as ButtonInterface;
			// 		if (!command) {
			// 			console.error(`Command ${interaction.customId} not found`);
			// 			throw new Error(`Command ${interaction.customId} not found`);
			// 		}

			// 		await command.run(client, interaction);
			// 	} catch (error) {
			// 		console.error(error);
			// 		if (interaction.replied) {
			// 			interaction.editReply({
			// 				content: "An error occurred while processing the command."
			// 			});
			// 		} else {
			// 			interaction.reply({
			// 				content: "An error occurred while processing the command.",
			// 				ephemeral: true
			// 			});
			// 		}
			// 	}
		//} 
		else {
			console.debug(interaction);
		}
	}
};

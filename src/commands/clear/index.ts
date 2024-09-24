import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { UserPermission } from "@/src/enums/UserPermission";

export const command: CommandInterface = {
	name: "clear",
	description: "Eliminar hasta 100 mensajes de un canal",
	type: ApplicationCommandType.ChatInput,
	default_member_permissions: UserPermission.ADMINISTRATOR,
	options: [
		{
			name: "cantidad",
			description: "Cantidad de mensajes a eliminar",
			type: ApplicationCommandOptionType.Integer,
			required: true,
			min_value: 1,
			max_value: 100
		},
		{
			name: "canal",
			description: "Canal de donde se eliminarán los mensajes",
			type: ApplicationCommandOptionType.Channel,
			channel_types: [ChannelType.GuildText]
		}
	],

	async run(client, interaction) {
		try {
			const amount = interaction.options.getInteger("cantidad");
			if (typeof amount !== "number")
				return interaction.reply({ content: "No se encontró la cantidad de mensajes.", ephemeral: true });

			let channel;

			const selectedChannel = interaction.options.getChannel("canal");
			if (!selectedChannel) {
				channel = interaction.channel;
			} else {
				channel = await client.channels.fetch(selectedChannel.id);
			}

			if (!channel) return interaction.reply({ content: "No se encontró el canal.", ephemeral: true });

			if (channel.type !== ChannelType.GuildText)
				return interaction.reply({ content: "El canal no es de texto.", ephemeral: true });

			const messages = await channel.messages.fetch({ limit: amount });
			await channel.bulkDelete(messages);

			interaction.reply({ content: `Se eliminaron ${messages.size} mensajes.`, ephemeral: true });
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

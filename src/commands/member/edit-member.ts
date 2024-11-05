import memberSchema from "@/src/database/schemas/Member";
import { Client } from "@/src/lib/classes";
import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";

const editMember = async (client: Client, interaction: ChatInputCommandInteraction) => {
	try {
		const selected = interaction.options.getUser("user");
		if (!selected) return interaction.reply({ content: "Usuario no encontrado.", ephemeral: true });

		if (selected.bot) return interaction.reply({ content: "No puedes seleccionar bots.", ephemeral: true });

		const user = await memberSchema.findOne({ "discord.id": selected.id });
		if (!user) return interaction.reply({ content: "El usuario no esta registrado.", ephemeral: true });

		let category = interaction.options.getChannel("category");
		let channel = interaction.options.getChannel("channel");

		if (!category?.id) return interaction.reply({ content: "Debes seleccionar una categoria.", ephemeral: true });
		if (!channel?.id) return interaction.reply({ content: "Debes seleccionar un canal.", ephemeral: true });

		if (category.type !== ChannelType.GuildCategory)
			return interaction.reply({ content: "La categoria seleccionada no es valida.", ephemeral: true });

		if (channel.type !== ChannelType.GuildText)
			return interaction.reply({ content: "El canal seleccionado no es valido.", ephemeral: true });

		await user.save();

		interaction.reply({ content: "Usuario editado correctamente.", ephemeral: true });
	} catch (error) {
		console.error(error);
		if (interaction.replied) {
			interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
		} else {
			interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
		}
	}
};

export default editMember;

import memberSchema from "@/src/database/schemas/Member";
import { Client } from "@/src/lib/classes";
import { ChatInputCommandInteraction } from "discord.js";

const hideMember = async (client: Client, interaction: ChatInputCommandInteraction) => {
	try {
		const selected = interaction.options.getUser("user");
		if (!selected) return interaction.reply({ content: "Usuario no encontrado.", ephemeral: true });

		if (selected.bot) return interaction.reply({ content: "No puedes seleccionar bots.", ephemeral: true });

		const user = await memberSchema.findOne({ "discord.id": selected.id });
		if (!user) return interaction.reply({ content: "El usuario no esta registrado.", ephemeral: true });

		if (user.hide) {
			user.hide = false;
			await user.save();

			return interaction.reply({ content: "Ya se podrá seleccionar a este usuario.", ephemeral: true });
		} else {
			user.hide = true;
			await user.save();

			return interaction.reply({ content: "Ya no se podrá seleccionar a este usuario.", ephemeral: true });
		}
	} catch (error) {
		console.error(error);
		if (interaction.replied) {
			interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
		} else {
			interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
		}
	}
};

export default hideMember;

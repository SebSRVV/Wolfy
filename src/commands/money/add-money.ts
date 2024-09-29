import { Client } from "@/src/lib/classes";
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";

import memberSchema from "@schemas/Member";

const addMoney = async (client: Client, interaction: ChatInputCommandInteraction) => {
	try {
		const miembro = interaction.options.getString("miembro");
		const monto = interaction.options.getNumber("monto");

		if (!miembro)
			return interaction.reply({
				content: "Debes ingresar el miembro al que le quieres retirar el dinero.",
				ephemeral: true
			});
		if (typeof monto !== "number")
			return interaction.reply({
				content: "El monto debe ser un número.",
				ephemeral: true
			});

		const member = await memberSchema.findOne({ "discord.id": miembro });
		if (!member)
			return interaction.reply({
				content: "El miembro no tiene una cuenta registrada.",
				ephemeral: true
			});

		if (monto <= 0)
			return interaction.reply({
				content: "El monto a agregar debe ser mayor a 0.",
				ephemeral: true
			});

		member.money.economy.push({
			amount: monto,
			reason: "Dinero añadido por un administrador",
			date: new Date()
		});

		await member.save();

		interaction.reply({
			content: `Se añadieron $${monto} a la cuenta de <@${miembro}>.`,
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
};

export default addMoney;

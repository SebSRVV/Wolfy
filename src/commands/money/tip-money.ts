import { Client } from "@/src/lib/classes";
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";

import memberSchema from "@schemas/Member";

const sendMoney = async (client: Client, interaction: ChatInputCommandInteraction) => {
	try {
		// Obtener los parámetros del comando
		const senderId = interaction.user.id; // El usuario que envía el dinero
		const receiverId = interaction.options.getString("miembro");
		const monto = interaction.options.getNumber("monto");

		// Validaciones iniciales
		if (!receiverId)
			return interaction.reply({
				content: "Debes ingresar el miembro al que le quieres enviar el dinero.",
				ephemeral: true
			});

		if (typeof monto !== "number" || monto <= 0)
			return interaction.reply({
				content: "El monto debe ser un número mayor a 0.",
				ephemeral: true
			});

		// Buscar las cuentas de ambos usuarios
		const sender = await memberSchema.findOne({ "discord.id": senderId });
		if (!sender)
			return interaction.reply({
				content: "No tienes una cuenta registrada.",
				ephemeral: true
			});

		const receiver = await memberSchema.findOne({ "discord.id": receiverId });
		if (!receiver)
			return interaction.reply({
				content: "El miembro al que quieres enviar dinero no tiene una cuenta registrada.",
				ephemeral: true
			});

		// Verificar que el remitente tenga suficiente dinero
		const availableFunds = sender.money.economy.reduce((acc, curr) => acc + curr.amount, 0) || 0;
		if (availableFunds < monto)
			return interaction.reply({
				content: `No tienes suficientes fondos. Tu balance actual es de $${availableFunds.toFixed(2)}.`,
				ephemeral: true
			});

		// Restar el monto del remitente y añadirlo al receptor
		sender.money.economy.push({
			amount: -monto,
			reason: "envío",
			date: new Date()
		});
		receiver.money.economy.push({
			amount: monto,
			reason: "recepción",
			date: new Date()
		});

		// Guardar los cambios en las cuentas
		await sender.save();
		await receiver.save();

		// Crear embed para el mensaje
		const embed = new EmbedBuilder()
			.setTitle("Transferencia de Dinero")
			.setDescription(`Has recibido $${monto.toFixed(2)} de <@${senderId}>.`)
			.setColor(Colors.Green)
			.setFooter({ text: `Transacción completada` })
			.setTimestamp();

		// Enviar mensaje directo al receptor
		const user = await client.users.fetch(receiverId); // Obtener al usuario por su ID
		if (user) {
			await user.send({ embeds: [embed] }); // Enviar mensaje directo al receptor
		} else {
			return interaction.reply({
				content: "No se pudo enviar el mensaje al miembro.",
				ephemeral: true
			});
		}

		// Responder al remitente que la transacción fue exitosa
		interaction.reply({
			content: `Has enviado $${monto.toFixed(2)} a <@${receiverId}>.`,
			ephemeral: true
		});
	} catch (error) {
		console.error(error);
		// Manejo de errores consistente
		if (interaction.replied) {
			await interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
		} else {
			await interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
		}
	}
};

export default sendMoney;

import { Client } from "@/src/lib/classes";
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";

import memberSchema from "@schemas/Member";
import { Emojis } from "@/src/enums";

const balanceMoney = async (client: Client, interaction: ChatInputCommandInteraction) => {
	try {
		const miembro = interaction.options.getString("miembro") || interaction.user.id;
		if (!miembro)
			return interaction.reply({
				content: "Debes ingresar el miembro al que le quieres retirar el dinero.",
				ephemeral: true
			});

		const member = await memberSchema.findOne({ "discord.id": miembro }).select("discord.id money");
		if (!member)
			return interaction.reply({
				content: "El miembro no tiene una cuenta registrada.",
				ephemeral: true
			});

		const username =
			(await interaction.guild?.members.fetch(miembro).then(member => member.user.username)) ||
			member.discord.username;

		const available = member.money.economy.reduce((acc, curr) => acc + curr.amount, 0);

		const hold = member.money.food.reduce((acc, curr) => acc + curr.amount, 0);

		const embed = new EmbedBuilder()
			.setColor(Colors.Green)
			.setTitle(`**BALANCE DE ${username.toUpperCase()}**`)
			.setDescription(
				`${Emojis.SPARKLE} **Dinero Disponible:**\n- ${Emojis.USD} **USD:** ${available.toFixed(2)}\n${Emojis.SPARKLE} **Comida:**\n- ${Emojis.TREAT} **Cinamon:** ${hold.toFixed(2)}`
			)
			.setFooter({
				text: `Actualizado:`
			})
			.setTimestamp();

		interaction.reply({ embeds: [embed], ephemeral: true });
	} catch (error) {
		console.error(error);
		if (interaction.replied) {
			interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
		} else {
			interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
		}
	}
};

export default balanceMoney;

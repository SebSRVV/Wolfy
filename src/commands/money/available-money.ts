import { Client } from "@/src/lib/classes";
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";

import memberSchema from "@schemas/Member";
import { Emojis } from "@/src/enums";

const availableMoney = async (client: Client, interaction: ChatInputCommandInteraction) => {
	try {
		const members = await memberSchema.find({}).select("money").exec();
		if (!members || members.length === 0)
			return interaction.reply({ content: "No hay dinero disponible.", ephemeral: true });

		const available = members
			.map(member => member.money.economy)
			.flat()
			.map(money => money.amount);

		const totalBefore = (available.reduce((acc, curr) => acc + curr, 0) ?? 0) as any;

		const total = totalBefore.toFixed(2);

		const embed = new EmbedBuilder()
			.setColor(Colors.Green)
			.setDescription(
				`${Emojis.SPARKLE} **DINERO AVAILABLE:**\n- ${Emojis.USD} **USD:** ${total}`
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

export default availableMoney;

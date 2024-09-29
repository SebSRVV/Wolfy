import { Client } from "@/src/lib/classes";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	Colors,
	EmbedBuilder
} from "discord.js";

import memberSchema from "@schemas/Member";
import { Emojis } from "@/src/enums";

export const moneyTypes = {
	"Dinero añadido por un administrador": "💵 Añadido",
	"Dinero removido por un administrador": "💸 Removido",
	"Withdraw Rejected": "❌ Retiro rechazado",
	"Retiro de grupo": "💸 Retiro de grupo",
	Warranty: "🛡️ Warranty",
	Done: `${Emojis.Check} Completado`,
	tip: `${Emojis.USD} Tip`,
	fee: "💸 Fee",
	Withdraw: "💸 Retirado"
} as any;

const historyMoney = async (client: Client, interaction: ChatInputCommandInteraction) => {
	try {
		const miembro = interaction.options.getString("miembro", false);
		const filter = interaction.options.getString("filter", false) || "all";

		let member: any;
		if (miembro) {
			member = await memberSchema.findOne({ "discord.id": miembro });
		} else {
			member = await memberSchema.findOne({ "discord.id": interaction.user.id });
		}

		if (!member) return interaction.reply({ content: "No se encontró al usuario.", ephemeral: true });

		const available = member.money.available.map((m: any) => {
			return { ...m._doc, typex: "available" };
		});
		const hold = member.money.hold.map((m: any) => {
			return { ...m._doc, typex: "hold" };
		});

		let mix = [];
		if (filter === "all") {
			mix = [...available, ...hold]
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
				.slice(0, 10);
		} else if (filter === "available") {
			mix = available.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
		} else if (filter === "hold") {
			mix = hold.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
		}

		const total =
			filter === "all" ? available.length + hold.length : filter === "available" ? available.length : hold.length;

		const format = {
			day: "2-digit",
			month: "short",
			year: "2-digit",
			timeZone: "America/Lima"
		} as any;

		const content = mix.map((m: any) => {
			const date = new Date(m.date);
			const type = moneyTypes[m.reason] || m.reason;
			const amount = m.amount;
			const datef = date.toLocaleDateString("es-ES", format);

			return `**${datef}** | ${type} | ${amount >= 0 ? Emojis.Wallet : Emojis.RED} ${amount >= 0 ? `+${amount}` : amount}$ ${m.order ? `| \`${m.order}\`` : ""}`;
		});

		const embed = new EmbedBuilder()
			.setTitle("Historial de transacciones")
			.setColor(Colors.Aqua)
			.setDescription(content.join("\n"))
			.setTimestamp();

		const previous = new ButtonBuilder()
			.setCustomId(`previous-history-money_${miembro}_${filter}_${0}`)
			.setLabel("◀")
			.setStyle(ButtonStyle.Primary)
			.setDisabled(true);

		const nothing = new ButtonBuilder()
			.setCustomId(`nothing`)
			.setLabel("1")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(true);

		const next = new ButtonBuilder()
			.setCustomId(`next-history-money_${miembro}_${filter}_${2}`)
			.setLabel("▶")
			.setStyle(ButtonStyle.Primary)
			.setDisabled(total <= 10);

		const row = new ActionRowBuilder().addComponents(previous, nothing, next) as any;

		interaction.reply({
			content: `${Emojis.SPARKLE} **Usuario:** ${member.discord.username}`,
			embeds: [embed],
			components: [row]
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

export default historyMoney;

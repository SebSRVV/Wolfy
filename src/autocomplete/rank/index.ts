import { PetOwners, PetStatus } from "@/src/database/schemas/Mascot";
import { AutocompleteInterface } from "@/src/types/Autocomplete";

import memberSchema from "@schemas/Member";
import orderSchema from "@schemas/Mascot";

export const command: AutocompleteInterface = {
	name: "rank",
	async run(client, interaction) {
		try {
			const focusedOption = interaction.options.getFocused(true);
			const value = focusedOption?.value?.toLowerCase();

			if (focusedOption.name === "miembro") {
				const members = await memberSchema
					.find({
						"discord.username": value
							? {
									$regex: new RegExp(value, "i")
								}
							: { $exists: true }
					})
					.limit(25)
					.select("discord.id discord.username")
					.lean();

				if (!members || members.length === 0) return interaction.respond([]);

				const options = members
					.filter(member => {
						const id = member.discord.id.toLowerCase();
						const username = member.discord.username.toLowerCase();

						return (
							id.includes(value.toLowerCase()) ||
							username.includes(value.toLowerCase())
						);
					})
					.map(member => ({
						name: `${member.discord.username} (${member.discord.id})`,
						value: member.discord.id
					}));

				await interaction.respond(options);
			}
		} catch (error) {
			console.error(error);
			interaction.respond([]);
		}
	}
};

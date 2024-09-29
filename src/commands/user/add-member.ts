import { PetOwners, PetStatus } from "@/src/database/schemas/Mascot";
import { AutocompleteInterface } from "@/src/types/Autocomplete";
import memberSchema from "@schemas/Member";
import orderSchema from "@schemas/Mascot";

export const command: AutocompleteInterface = {
	name: "money",
	async run(client, interaction) {
		try {
			const focusedOption = interaction.options.getFocused(true);
			const value = focusedOption?.value?.toLowerCase();

			// Autocompletar miembros
			if (focusedOption.name === "miembro") {
				const members = await memberSchema
					.find({
						"discord.username": value
							? { $regex: new RegExp(value, "i") }
							: { $exists: true }
					})
					.limit(25)
					.select("discord.id discord.username")
					.lean();

				if (!members || members.length === 0) return interaction.respond([]);

				const options = members.map(member => ({
					name: `${member.discord.username} (${member.discord.id})`,
					value: member.discord.id
				}));

				await interaction.respond(options);
			
			// Autocompletar por órdenes de mascotas
			} else if (focusedOption.name === "order") {
				const pets = await orderSchema
					.find({
						id: value
							? { $regex: new RegExp(value, "i") }
							: { $exists: true },
						status: { $nin: [PetStatus.Death, PetStatus.Sick, PetStatus.Hungry] }
					})
					.limit(25)
					.select("id owner")
					.lean();

				if (!pets || pets.length === 0) return interaction.respond([]);

			
			// Autocompletar por propietarios
			} else if (focusedOption.name === "owner") {
				const options = Object.keys(PetOwners)
					.filter(owner => owner.toLowerCase().includes(value.toLowerCase()))
					.map(owner => ({
						name: `${owner} (${PetOwners[owner as keyof typeof PetOwners]})`,
						value: owner
					}));

				await interaction.respond(options);
			}
		} catch (error) {
			console.error(error);
			interaction.respond([]);
		}
	}
};

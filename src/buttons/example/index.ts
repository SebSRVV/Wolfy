import { ButtonInterface } from "@/src/types/Button";

export const command: ButtonInterface = {
	name: "example",
	async run(client, interaction) {
		try {
		} catch (error) {
			console.error(error);
			interaction.reply({
				content: "Ocurrió un error mientras se procesaba el boton.",
				ephemeral: true
			});
		}
	}
};

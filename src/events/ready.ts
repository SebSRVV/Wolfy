import { EventInterface } from "@/src/types/Event";

export const event: EventInterface = {
	name: "ready",
	once: true,
	run: async client => {
		try {
			await client.manager
				.init({ ...client.user! })
				.then(() => {
					console.info("Lavalink is ready");
				})
				.catch(console.error);
			console.info(`Bot conectado como ${client.user?.tag}`);
		} catch (error) {
			console.error("An error occurred while the bot was starting up", error);
		}
	}
};

import { EventInterface } from "@/src/types/Event";

export const event: EventInterface = {
	name: "raw",
	run: async (client, d) => {
		try {
			client.manager.sendRawData(d);
		} catch (error) {
			console.error("An error occurred while the bot was starting up", error);
		}
	}
};

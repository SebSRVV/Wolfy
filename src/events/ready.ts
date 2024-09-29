import { EventInterface } from "@/src/types/Event";
import { ActivityType } from "discord.js";

export const event: EventInterface = {
    name: "ready",
    once: true,
    run: async client => {
        try {
            console.info(`Bot conectado como ${client.user?.tag}`);
        } catch (error) {
            console.error("An error occurred while the bot was starting up", error);
        }
    }
};
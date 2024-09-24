import { EventInterface } from "@/src/types/Event";
import { Message } from "discord.js";
import { Schema } from "zod";

export const event: EventInterface = {
    name: "messageCreate",
    run: async (client,message:Message) => {
        try {
            message.channel
            console.info("I'm ready");
        } catch (error) {
            console.error("An error occurred while the bot was starting up", error);
        }
    }
};
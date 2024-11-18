import { Client } from "@lib/classes";
import { ClientEvents } from "discord.js";

interface Run {
	(client: Client, ...args: any[]): void;
}

export interface EventInterface {
	name: keyof ClientEvents | "raw";
	once?: boolean;
	run: Run;
}

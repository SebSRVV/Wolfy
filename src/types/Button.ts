import { ButtonInteraction, Guild } from "discord.js";
import { Client } from "@lib/classes";

export interface ButtonInterface {
	name: string;
	run: (
		client: Client,
		interaction: ButtonInteraction & {
			guild: Guild;
		}
	) => void;
}

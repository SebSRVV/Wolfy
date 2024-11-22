import { ButtonInteraction } from "discord.js";
import { Client } from "@lib/classes";

export interface ButtonInterface {
	name: string;
	run: (client: Client, interaction: ButtonInteraction) => void;
}

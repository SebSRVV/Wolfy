import { AutocompleteInteraction } from "discord.js";
import { Client } from "@lib/classes";

export interface AutocompleteInterface {
	name: string;
	run: (client: Client, interaction: AutocompleteInteraction) => void;
}

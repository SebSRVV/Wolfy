import { Client as OldClient, type ClientOptions, Collection } from "discord.js";

import { CommandInterface } from "@/src/types/Command";
import { EventInterface } from "@/src/types/Event";
import { AutocompleteInterface } from "../types/Autocomplete";
// import { SelectmenusInterface } from "../types/Selectmenus";
// import { ButtonInterface } from "../types/Button";

export class Client extends OldClient {
	commands: Collection<string, CommandInterface> | null;
	events: Collection<string, EventInterface> | null;
	autocomplete: Collection<string, AutocompleteInterface> | null;
	// selectmenus: Collection<string, SelectmenusInterface> | null;
	// buttons: Collection<string, ButtonInterface> | null;
	static commands: any;

	constructor(Intents: ClientOptions) {
		super(Intents);
		this.commands = new Collection();
		this.events = new Collection();
		this.autocomplete = new Collection();
		// this.selectmenus = new Collection();
		// this.buttons = new Collection();
	}
}

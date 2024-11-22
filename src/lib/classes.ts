import { Client as OldClient, type ClientOptions, Collection } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { EventInterface } from "@/src/types/Event";
import { AutocompleteInterface } from "../types/Autocomplete";
import lavalink from "./lavalink";
import { LavalinkManager } from "lavalink-client/dist/types";
import { ButtonInterface } from "../types/Button";
//import { WolfyMLP } from "@/src/lib/wolfymlp";
//import { WolfyNLP } from "@/src/lib/wolfynlp";

export class Client extends OldClient {
	commands: Collection<string, CommandInterface>;
	buttons: Collection<string, ButtonInterface>;
	events: Collection<string, EventInterface>;
	autocomplete: Collection<string, AutocompleteInterface>;
	manager: LavalinkManager = lavalink(this);
	static instance: Client;

	constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection();
		this.buttons = new Collection();
		this.events = new Collection();
		this.autocomplete = new Collection();

		Client.instance = this;
	}

	static getInstance(): Client {
		return this.instance;
	}

}

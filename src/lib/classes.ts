import { Client as OldClient, type ClientOptions, Collection } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { EventInterface } from "@/src/types/Event";
import { AutocompleteInterface } from "../types/Autocomplete";
import lavalink from "./lavalink";
import { LavalinkManager } from "lavalink-client/dist/types";


export class Client extends OldClient {
	commands: Collection<string, CommandInterface>;
	events: Collection<string, EventInterface>;
	autocomplete: Collection<string, AutocompleteInterface>;
	manager: LavalinkManager = lavalink(this);
	static instance: Client;

	constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection();
		this.events = new Collection();
		this.autocomplete = new Collection();

		Client.instance = this;
	}

	static getInstance(): Client {
		return this.instance;
	}

}

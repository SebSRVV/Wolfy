import { Client as OldClient, type ClientOptions, Collection } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { EventInterface } from "@/src/types/Event";
import { AutocompleteInterface } from "../types/Autocomplete";

export class Client extends OldClient {
    commands: Collection<string, CommandInterface> | null;
    events: Collection<string, EventInterface> | null;
    autocomplete: Collection<string, AutocompleteInterface> | null;
    static instance: Client;

    constructor(Intents: ClientOptions) {
        super(Intents);
        this.commands = new Collection();
        this.events = new Collection();
        this.autocomplete = new Collection();
        Client.instance = this;
    }

    static getInstance() {
        return this.instance;
    }
}

// src/lib/client.ts
import { Client as OldClient, ClientOptions, Collection } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { EventInterface } from "@/src/types/Event";
import { AutocompleteInterface } from "../types/Autocomplete";
import { Manager } from "erela.js"; 

export class Client extends OldClient {
    commands: Collection<string, CommandInterface> | null;
    events: Collection<string, EventInterface> | null;
    autocomplete: Collection<string, AutocompleteInterface> | null;
    manager: Manager; 

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
        this.events = new Collection();
        this.autocomplete = new Collection();
        this.manager = new Manager({
            nodes: [
                {
                    host: "0.0.0.0", 
                    port: 2333,
                    password: "wolfy12"
                }
            ],
            send: (id, payload) => {
                const guild = this.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        });
    }
}

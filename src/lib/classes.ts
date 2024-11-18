import { Client as OldClient, type ClientOptions, Collection } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { EventInterface } from "@/src/types/Event";
import { AutocompleteInterface } from "../types/Autocomplete";
//import { WolfyMLP } from "@/src/lib/wolfymlp"; 
//import { WolfyNLP } from "@/src/lib/wolfynlp";

export class Client extends OldClient {
    commands: Collection<string, CommandInterface>;
    events: Collection<string, EventInterface>;
    autocomplete: Collection<string, AutocompleteInterface>;
    static instance: Client;

   // wolfy: WolfyMLP;
   // nlp: WolfyNLP;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
        this.events = new Collection();
        this.autocomplete = new Collection();

        // Initialize instances of WolfyMLP and WolfyNLP
      //  this.wolfy = new WolfyMLP([3, 5, 1]); // Adjust layer sizes as necessary
      //  this.nlp = new WolfyNLP();

        Client.instance = this;
    }

    static getInstance(): Client {
        return this.instance;
    }

//     // You can add more methods here to interact with WolfyMLP and WolfyNLP
//    // public analyzeMessage(message: string): number[] {
//     //    return this.nlp.extractFeatures(message);
//    // }

//    // public trainModel(inputs: number[], target: number): void {
//         this.wolfy.train(inputs, target);
//     }

//     public predict(inputs: number[]): number {
//         return this.wolfy.predict(inputs);
//     }

//     public getModelWeights(): number[][][] {
//         return this.wolfy.getWeights();
//     }
}

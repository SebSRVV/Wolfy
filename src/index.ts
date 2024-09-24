import "@console";
import "./env";
import "@database";

import { GatewayIntentBits } from "discord.js";
import { Client } from "./lib/classes";

import Handler from "./lib/handler";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages
	]
});

const handler = new Handler(client);

handler.init();
//handler.publishCommands();

client.login(process.env.DiscordTokenKey);

export { client };
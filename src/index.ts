import "@console";
import "./env";
import "@database";

import { GatewayIntentBits, GuildWidgetStyle } from "discord.js";
import { Client } from "./lib/classes";

import Handler from "./lib/handler";
import { Manager } from "erela.js";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildVoiceStates
	]
});

const handler = new Handler(client);
handler.init();
handler.publishCommands();

client.login(process.env.DiscordTokenKey);

export { client };


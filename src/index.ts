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
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildVoiceStates
	]
});

const handler = new Handler(client);

// Cambia esta línea para esperar la inicialización
(async () => {
	await handler.init();
	await handler.publishCommands();
	client.login(process.env.DiscordTokenKey);
})();

export { client };

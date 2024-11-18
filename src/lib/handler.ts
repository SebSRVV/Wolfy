import { readdirSync } from "node:fs";
import path from "node:path";

import { Client } from "./classes";

import { Routes, REST } from "discord.js";
import { pathToFileURL } from "node:url";
import { CommandInterface } from "../types/Command";

export default class Handler {
	private client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	async init() {
		await this.retrieveCommands();
		await this.retrieveEvents();
		await this.retrieveAutocomplete();
		// await this.retrieveSelectmenu();
		// await this.retrieveButton();
	}

	retrieveCommands = async () => {
		const commandsPath = path.join(__dirname, "../commands");
		const commandFiles = readdirSync(commandsPath);

		commandFiles.forEach(async cmd => {
			const filePath = pathToFileURL(path.join(commandsPath, cmd))?.href;
			if (!filePath) return console.error("Command path not found");

			const { command } = (await import(filePath)) as { command: CommandInterface };

			if (!command) return;
			if (!command?.name) {
				console.warn(`${command} doesn't have the "name" property`);
				return;
			}
			this.client.commands?.set(command.name, command);
		});
	};

	retrieveAutocomplete = async () => {
		const commandsPath = path.join(__dirname, "../autocomplete");
		const commandFiles = readdirSync(commandsPath);

		commandFiles.forEach(async cmd => {
			const filePath = pathToFileURL(path.join(commandsPath, cmd))?.href;
			if (!filePath) return console.error("Autocomplete path not found");

			const { command } = await import(filePath);
			if (!command?.name) {
				console.warn(`${command} doesn't have the "name" property`);
				return;
			}
			this.client.autocomplete?.set(command.name, command);
		});
	};

	// retrieveSelectmenu = async () => {
	// 	const commandsPath = path.join(__dirname, "../selectmenus");
	// 	const commandFiles = readdirSync(commandsPath);

	// 	commandFiles.forEach(async cmd => {
	// 		const filePath = pathToFileURL(path.join(commandsPath, cmd))?.href;
	// 		if (!filePath) return console.error("SelectMenu path not found");

	// 		const { command } = await import(filePath);
	// 		if (!command?.name) {
	// 			console.warn(`${command} doesn't have the "name" property`);
	// 			return;
	// 		}
	// 		this.client.selectmenus?.set(command.name, command);
	// 	});
	// };

	// retrieveButton = async () => {
	// 	const commandsPath = path.join(__dirname, "../buttons");
	// 	const commandFiles = readdirSync(commandsPath);

	// 	commandFiles.forEach(async cmd => {
	// 		const filePath = pathToFileURL(path.join(commandsPath, cmd))?.href;
	// 		if (!filePath) return console.error("Button path not found");

	// 		const { command } = await import(filePath);
	// 		if (!command?.name) {
	// 			console.warn(`${command} doesn't have the "name" property`);
	// 			return;
	// 		}
	// 		this.client.buttons?.set(command.name, command);
	// 	});
	// };

	async publishCommands() {
		const commandsPath = path.join(__dirname, "../commands");
		const files = readdirSync(commandsPath);

		// Use map to create an array of promises
		const promises = files.map(async file => {
			const filePath = pathToFileURL(path.join(commandsPath, file))?.href;
			if (!filePath) {
				console.error("Command path not found");
				return null; // Returning null for unsuccessful imports
			}

			const { command } = await import(filePath);
			if (!command?.name) {
				console.warn(`${command} doesn't have the "name" property`);
				return null; // Returning null for invalid commands
			}

			return {
				...command,
				permissions: {}
			};
		});

		// Wait for all promises to resolve
		const arrayOfSlashCommands = await Promise.all(promises);

		// Filter out null values (failed imports or invalid commands)
		const validCommands = arrayOfSlashCommands.filter(command => command !== null);

		const rest = new REST().setToken(process.env.DiscordTokenKey);

		const data: any = await rest.put(Routes.applicationCommands(process.env.DiscordClientID), {
			body: validCommands
		});

		console.info(`Successfully registered ${data.length} slashCommands`);
	}

	async retrieveEvents() {
		const eventsPath = path.join(__dirname, "../events");

		readdirSync(eventsPath).forEach(async file => {
			const eventPath = pathToFileURL(path.join(eventsPath, file))?.href;
			if (!eventPath) return console.error("Event path not found");

			const { event } = await import(eventPath);
			if (!event?.name) return console.warn(`${event} doesn't have the "name" property`);

			this.client.events?.set(event.name, event);
			if (event.once) this.client.once(event.name, (...args) => event.run(this.client, ...args));
			else this.client.on(event.name, (...args) => event.run(this.client, ...args));
		});
	}
}

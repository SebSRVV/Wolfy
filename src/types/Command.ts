import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ChannelType,
	ChatInputCommandInteraction
} from "discord.js";
import { Client } from "@lib/classes";
import { DiscordLanguages } from "@enums/DiscordLanguages";

export interface CommandInterface {
	type: ApplicationCommandType;
	name: string;
	name_localizations?: {
		[key in DiscordLanguages]?: string;
	};
	description: string;
	description_localizations?: {
		[key in DiscordLanguages]?: string;
	};
	options?: CommandOption[];
	default_member_permissions?: number;
	permissions?: {
		[key: string]: {
			channel?: boolean;
			perms: bigint;
		};
	};
	dm_permission?: boolean;
	nfsw?: boolean;
	integration_types?: string[];
	contexts?: string[];
	run: (client: Client, interaction: ChatInputCommandInteraction) => void;
}

interface CommandOption {
	type: ApplicationCommandOptionType;
	name: string;
	name_localizations?: {
		[key in DiscordLanguages]?: string;
	};
	description: string;
	description_localizations?: {
		[key in DiscordLanguages]?: string;
	};
	required?: boolean;
	choices?: CommandOptionChoice[];
	options?: CommandOption[];
	channel_types?: ChannelType[];
	min_value?: number;
	max_value?: number;
	min_length?: number;
	max_length?: number;
	autocomplete?: boolean;
}

interface CommandOptionChoice {
	name: string;
	name_localizations?: {
		[key in DiscordLanguages]?: string;
	};
	value: string;
}

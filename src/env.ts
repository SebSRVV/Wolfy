import "dotenv/config";

import { z } from "zod";

const environmentSchema = z.object({
	DiscordTokenKey: z.string(),
	DiscordClientID: z.string(),
	DiscordSecretID: z.string(),
	DB_URL: z.string()
});

const {
	DiscordTokenKey,
	DiscordClientID,
	DiscordSecretID,
	DB_URL
} = process.env;

const parseResults = environmentSchema.safeParse({
	DiscordTokenKey,
	DiscordClientID,
	DiscordSecretID,
	DB_URL
});

if (!parseResults.success) {
	console.error(parseResults.error);
	throw new Error("Environment don't match schema");
}

type EnvVarSchemaType = z.infer<typeof environmentSchema>;

declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvVarSchemaType {}
	}
}

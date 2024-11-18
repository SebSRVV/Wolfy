import { LavalinkManager } from "lavalink-client";
import { Client } from "./classes";

const lavalink = (client: Client) =>
	new LavalinkManager({
		nodes: [
			{
				authorization: "iohVgwLjGNlr5pRrPJD1wR0fTZBEqMQs",
				host: "82.197.67.160",
				port: 2333,
				id: "main",
				requestSignalTimeoutMS: 3000,
				closeOnError: true,
				heartBeatInterval: 30_000,
				enablePingOnStatsCheck: true,
				retryDelay: 10e3,
				secure: false,
				retryAmount: 5
			}
		],
		sendToShard: (guildId: string, payload: any) => client.guilds.cache.get(guildId)?.shard?.send(payload),
		client: {
			id: client.user?.id || "0",
			username: client.user?.username,
		},
		autoSkip: true,
		playerOptions: {
			applyVolumeAsFilter: false,
			clientBasedPositionUpdateInterval: 50, // in ms to up-calc player.position
			defaultSearchPlatform: "ytmsearch",
			volumeDecrementer: 0.75, // on client 100% == on lavalink 75%
			// requesterTransformer: requesterTransformer,
			onDisconnect: {
				autoReconnect: false, // automatically attempts a reconnect, if the bot disconnects from the voice channel, if it fails, it get's destroyed
				destroyPlayer: true // overrides autoReconnect and directly destroys the player if the bot disconnects from the vc
			},
			onEmptyQueue: {
				destroyAfterMs: 30_000 // 0 === instantly destroy | don't provide the option, to don't destroy the player
				// autoPlayFunction: autoPlayFunction
			},
			useUnresolvedData: true
		},
		queueOptions: {
			maxPreviousTracks: 10
			// queueStore: new myCustomStore(client.redis),
			// queueChangesWatcher: new myCustomWatcher(client)
		},
		linksBlacklist: [],
		linksWhitelist: [],
		advancedOptions: {
			maxFilterFixDuration: 600_000, // only allow instafixfilterupdate for tracks sub 10mins
			debugOptions: {
				noAudio: true,
				playerDestroy: {
					dontThrowError: true,
					debugLog: true
				}
			}
		}
	});

export default lavalink;

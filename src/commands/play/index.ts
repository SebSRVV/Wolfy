import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	GuildMember,
	VoiceChannel
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { Player, SearchPlatform, SearchResult } from "lavalink-client/dist/types";
import { EmbedBuilder } from "discord.js";

export const command: CommandInterface = {
	name: "play",
	description: "Reproduce música en un canal de voz",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "song",
			description: "Nombre de la canción a reproducir",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true
		}
	],
	async run(client, interaction) {
		try {
			if (!interaction.guild) return interaction.reply({ content: "Debes estar en un servidor", ephemeral: true });

			const vcId = (interaction.member as GuildMember)?.voice?.channelId;
			if (!vcId)
				return interaction.reply({
					content: "Debes estar en un canal de voz para usar este comando.",
					ephemeral: true
				});

			const vc = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel;
			if (!vc.joinable || !vc.speakable)
				return interaction.reply({
					ephemeral: true,
					content: "No tengo permisos para unirme o hablar en ese canal de voz."
				});

			const song = interaction.options.getString("song");
			const source = (interaction.options.getString("source") || "ytsearch") as SearchPlatform | undefined;
			if (!song) return interaction.reply({ content: "Debes ingresar un nombre de canción.", ephemeral: true });

			if (song === "join_guild")
				return interaction.reply({ content: `Debes estar en un servidor`, ephemeral: true });
			if (song === "nothing_found")
				return interaction.reply({ content: `No se encontraron canciones`, ephemeral: true });
			if (song === "join_vc")
				return interaction.reply({
					content: `Debes estar en un canal de voz para usar este comando.`,
					ephemeral: true
				});

			const player = (client.manager.getPlayer(interaction.guild.id) ||
				client.manager.createPlayer({
					guildId: interaction.guild.id,
					voiceChannelId: vcId,
					textChannelId: interaction.channelId,
					selfDeaf: true,
					selfMute: false,
					volume: 70,
					instaUpdateFiltersFix: true, 
					applyVolumeAsFilter: false, 
					node: "main"
				})) as Player;

			const connected = player.connected;
			if (!connected) await player.connect();

			if (player.voiceChannelId !== vcId)
				return interaction.reply({
					content: `Debes estar en el mismo canal de voz que yo para usar este comando.`,
					ephemeral: true
				});

			const response = (await player.search({ query: song, source }, interaction.user)) as SearchResult;

			if (!response || !response.tracks?.length)
				return interaction.reply({ content: `No se encontraron canciones.`, ephemeral: true });

			await player.queue.add(response.loadType === "playlist" ? response.tracks : response.tracks[0]);
			await interaction.reply({
				embeds: [
					response.loadType === "playlist"
						? new EmbedBuilder()
							  .setColor(0x00ff00)
							  .setTitle("✅ Playlist Añadida")
							  .setDescription(
								  `Se añadieron **${response.tracks.length} canciones** de la playlist [${
									  response.playlist?.title || "Sin título"
								  }](${response.playlist?.uri || "#"})`
							  )
							  .setFooter({ text: "Disfruta tu música 🎵" })
							  .setTimestamp()
						: new EmbedBuilder()
							  .setColor(0x1e90ff)
							  .setTitle("✅ Canción Añadida")
							  .setDescription(
								  `🎵 **Canción:** [${response.tracks[0].info.title}](${response.tracks[0].info.uri})\n👤 **Autor:** ${
									  response.tracks[0].info.author
								  }\n🔢 **Posición en la cola:** #${player.queue.tracks.length}`
							  )
							  .setFooter({ text: "Disfruta tu música 🎵" })
							  .setTimestamp(),
				],
				ephemeral: true,
			});

			if (!player.playing) {
				await player.play(connected ? { volume: 70, paused: false } : undefined);
				player.setVolume(70);
			}
		} catch (error) {
			console.error(error);
			if (interaction.replied) {
				interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
			} else {
				interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
			}
		}
	}
};

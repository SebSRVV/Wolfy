import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { CommandInterface } from "@/src/types/Command";

export const command: CommandInterface = {
	name: "play",
	description: "Play a song",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "query",
			description: "The song you want to play",
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	async run(client, interaction) {
		if (!interaction.guild) return interaction.reply("This command can only be used in a server.");
		if (!interaction.member) return interaction.reply("You need to be in a guild to use this command.");
		if (!interaction.channel) return interaction.reply("You need to be in a channel to use this command.");

		const member = interaction.member as any;

		if (!member.voice) return interaction.reply("You need to join a voice channel.");
		if (!member.voice.channel) return interaction.reply("You need to join a voice channel.");

		const { channel } = member.voice;
		const query = interaction.options.getString("query");

		if (!channel)
			return interaction.reply({
				content: "You need to join a voice channel."
			});
		if (!query)
			return interaction.reply({
				content: "You need to provide a search query."
			});

		const player = client.manager.create({
			guild: interaction.guild.id,
			voiceChannel: channel.id,
			textChannel: interaction.channel.id
		});

		if (player.state !== "CONNECTED") player.connect();

		const search = query;
		let res;

		try {
			res = await player.search(search, interaction.user);
			if (res.loadType === "LOAD_FAILED") {
				if (!player.queue.current) player.destroy();
				throw res.exception;
			}
		} catch (err) {
			return interaction.reply(`there was an error while searching`);
		}

		if (!res.tracks.length) return interaction.reply("No tracks were found.");

		switch (res.loadType) {
			case "NO_MATCHES":
				if (!player.queue.current) player.destroy();
				return interaction.reply("there were no results found.");
			case "TRACK_LOADED":
				player.queue.add(res.tracks[0]);

				if (!player.playing && !player.paused && !player.queue.size) player.play();
				return interaction.reply(`enqueuing \`${res.tracks[0].title}\`.`);
			case "PLAYLIST_LOADED":
				player.queue.add(res.tracks);

				if (!res.playlist) return interaction.reply("No tracks were found.");

				if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
				return interaction.reply(`enqueuing playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks.`);
			case "SEARCH_RESULT": {
				const track = res.tracks[0];
				player.queue.add(track);

				if (!player.playing && !player.paused && !player.queue.size)
					player.play();

				return interaction.reply(`enqueuing \`${track.title}\`.`);
			}
		}
	}
};

import { Colors, EmbedBuilder, TextChannel } from "discord.js";
import { Client } from "./classes";
import { Manager } from "erela.js";

const lavalink = (client: Client) =>
	new Manager({
		// plugins: [
		// 	new Spotify({
		// 		clientID,
		// 		clientSecret
		// 	})
		// ],
		nodes: [
			{
				host: "localhost",
				port: 2333,
				password: "wolfy12",
				retryDelay: 5000
			}
		],
		autoPlay: true,
		send: (id, payload) => {
			const guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		}
	})
		.on("nodeConnect", node => console.log(`Node "${node.options.identifier}" connected.`))
		.on("nodeError", (node, error) =>
			console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
		)
		.on("trackStart", (player, track) => {
			if (!player.textChannel) return;
			if (!client.user) return;

			const channel = client.channels.cache.get(player.textChannel) as TextChannel;
			if (!channel) return;
			const embed = new EmbedBuilder()
				.setColor("#00f70c")
				.setAuthor({
					name: `Now Playing:`,
					iconURL: client.user.displayAvatarURL()
				})
				.setDescription(`${track.title}`)
				.setTimestamp();

			channel.send({
				embeds: [embed]
			});
		})
		.on("trackStuck", (player, track) => {
			if (!player.textChannel) return;
			if (!client.user) return;
			const channel = client.channels.cache.get(player.textChannel) as TextChannel;
			if (!channel) return;
			const embed = new EmbedBuilder()
				.setColor(Colors.Red)
				.setAuthor({
					name: `Track Stuck:`,
					iconURL: client.user.displayAvatarURL()
				})
				.setDescription(`${track.title}`)
				.setTimestamp();
			channel.send({
				embeds: [embed]
			});
		})
		.on("queueEnd", player => {
			if (!player.textChannel) return;

			const channel = client.channels.cache.get(player.textChannel) as TextChannel;
			if (!channel) return;

			channel.send({
				content: "Queue has ended. Leaving voice channel."
			});

			player.destroy();
		});

export default lavalink;

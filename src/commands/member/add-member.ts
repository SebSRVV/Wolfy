import memberSchema, { MemberRanks} from "@/src/database/schemas/Member";
import { RankRoles } from "@/src/enums";
import { Client } from "@/src/lib/classes";
import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, PermissionsBitField } from "discord.js";

const addMember = async (client: Client, interaction: ChatInputCommandInteraction) => {
	try {
		const selected = interaction.options.getUser("user");
		if (!selected) return interaction.reply({ content: "Usuario no encontrado.", ephemeral: true });

		if (selected.bot) return interaction.reply({ content: "No puedes seleccionar bots.", ephemeral: true });

		const role = interaction.options.getString("rank");
		if (!role) return interaction.reply({ content: "Debes ingresar un rango.", ephemeral: true });

		const user = await memberSchema.findOne({ "discord.id": selected.id });
		if (user) return interaction.reply({ content: "El usuario ya esta registrado.", ephemeral: true });

		let category = interaction.options.getChannel("category");
		let channel = interaction.options.getChannel("channel");

		if (!category) {
			category = (await interaction.guild?.channels.create({
				name: `PRIVATE ${selected.username}`,
				type: ChannelType.GuildCategory,
				permissionOverwrites: [
					{
						id: selected.id,
						allow: [PermissionsBitField.Flags.ViewChannel]
					},
					{
						id: interaction.guild?.id,
						deny: [PermissionsBitField.Flags.ViewChannel]
					}
				],
				position: 0,
				reason: "Creating private category for user"
			})) as any;
		}

		if (!channel) {
			channel = (await interaction.guild?.channels.create({
				name: "【🌐】𝐏𝐑𝐈𝐕",
				type: ChannelType.GuildText,
				parent: category?.id,
				permissionOverwrites: [
					{
						id: selected.id,
						allow: [PermissionsBitField.Flags.ViewChannel]
					},
					{
						id: interaction.guild?.id,
						deny: [PermissionsBitField.Flags.ViewChannel]
					}
				],
				position: 0,
				reason: "Creating general channel for user"
			})) as any;
		}

		if (category?.type !== ChannelType.GuildCategory)
			return interaction.reply({ content: "La categoria seleccionada no es valida.", ephemeral: true });

		if (channel?.type !== ChannelType.GuildText)
			return interaction.reply({ content: "El canal seleccionado no es valido.", ephemeral: true });

		await new memberSchema({
			discord: {
				id: selected.id,
				username: selected.username,
				category: category?.id,
				channel: channel?.id
			},
			money: {
				available: [],
				hold: []
			},
			rank: role,
			createdAt: new Date(),
			updatedAt: new Date()
		}).save();

		const member = await interaction.guild?.members
			.fetch(interaction.user.id)
			.then(m => m)
			.catch(() => null);
		if (!member)
			return interaction.reply({
				content: "No se pudo encontrar al usuario.",
				ephemeral: true
			});

		const roleKey = role.charAt(0).toUpperCase() + role.slice(1);
		const roleID = RankRoles[roleKey as keyof typeof RankRoles];
		if (!roleID)
			return interaction.reply({
				content: "Rol inválido.",
				ephemeral: true
			});

		const roleAdded = await member.roles
			.add(roleID)
			.then(() => true)
			.catch(() => false);
		if (!roleAdded)
			return interaction.reply({
				content: "No se pudo añadir el rol. Por favor, hacerlo manualmente.",
				ephemeral: true
			});

		interaction.reply({ content: "Usuario añadido correctamente.", ephemeral: true });
	} catch (error) {
		console.error(error);
		if (interaction.replied) {
			interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
		} else {
			interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
		}
	}
};

export default addMember;

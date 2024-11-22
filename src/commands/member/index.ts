import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChannelType,
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import removeMember from "./remove-member";
import hideMember from "./hide-member";
import editMember from "./edit-member";
import addMember from "./add-member";
import { listMember } from "./list-member";
import { nukeMember } from "./nuke-member";
import { MemberRanks } from "@/src/database/schemas/Member";
import { UserPermission } from "@/src/enums/UserPermission";

export const command: CommandInterface = {
    name: "member",
    description: "Configurar los miembros",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: UserPermission.ADMINISTRATOR,
    options: [
        {
            name: "add",
            description: "Añadir un miembro",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Usuario a añadir",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "rank",
                    description: "Rango del miembro",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: Object.values(MemberRanks).map((rank) => ({
                        name: rank.charAt(0).toUpperCase() + rank.slice(1),
                        value: rank,
                    })),
                },
                {
                    name: "category",
                    description: "Categoria a añadir (si no tiene una se le creará una automáticamente)",
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildCategory],
                    required: false,
                },
                {
                    name: "channel",
                    description: "Canal donde se escribirán los mensajes (si no tiene uno se le creará automáticamente)",
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText],
                    required: false,
                },
            ],
        },
        {
            name: "edit",
            description: "Editar un miembro",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Usuario a editar",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "category",
                    description: "Categoria a editar",
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildCategory],
                    required: true,
                },
                {
                    name: "channel",
                    description: "Canal a editar",
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText],
                    required: true,
                },
            ],
        },
        {
            name: "remove",
            description: "Remover un miembro",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Usuario a remover",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
        },
        {
            name: "hide",
            description: "Ocultar un miembro",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Usuario a ocultar",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
        },
        {
            name: "list",
            description: "Listar todos los miembros registrados",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "nuke",
            description: "Eliminar completamente a un miembro (base de datos, canales, roles)",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "Usuario a eliminar completamente",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
        },
    ],

    async run(client, interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === "add") {
                addMember(client, interaction);
            } else if (subcommand === "edit") {
                editMember(client, interaction);
            } else if (subcommand === "remove") {
                removeMember(client, interaction);
            } else if (subcommand === "hide") {
                hideMember(client, interaction);
            } else if (subcommand === "list") {
                await listMember(interaction);
            } else if (subcommand === "nuke") {
                await nukeMember(interaction);
            } else {
                interaction.reply({
                    content: "Subcomando no encontrado.",
                    ephemeral: true,
                });
            }
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
            } else {
                interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
            }
        }
    },
};

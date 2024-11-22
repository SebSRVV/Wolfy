import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import { Emojis } from "@/src/enums";

export const command: CommandInterface = {
    name: "help",
    description: "Muestra todos los comandos",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "command",
            description: "Muestra información de un comando específico",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    async run(client, interaction) {
        try {
            if (!client.commands || client.commands.size === 0) {
                return interaction.reply({ content: "No hay comandos registrados.", ephemeral: true });
            }

            const requestedCommand = interaction.options.getString("command");

            if (requestedCommand) {
                const command = client.commands.get(requestedCommand);
                if (!command) {
                    return interaction.reply({ content: `No se encontró el comando \`${requestedCommand}\`.`, ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle(`Información del comando: ${command.name}`)
                    .setDescription(command.description)
                    .setColor(0xFFFF00);

                const subcommands = command.options?.filter(option => option.type === ApplicationCommandOptionType.Subcommand);
                if (subcommands && subcommands.length > 0) {
                    embed.addFields(
                        subcommands.map(subcommand => ({
                            name: `${Emojis.Arrow} \`${subcommand.name}\``,
                            value: subcommand.description,
                        }))
                    );
                } else {
                    embed.addFields({
                        name: "Subcomandos",
                        value: "No hay subcomandos disponibles",
                    });
                }

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Si no se solicita un comando específico, mostrar todos los comandos
            const commandsPerField = 10; // Máximo número de comandos por campo
            const commandsArray = client.commands.map(
                command => `${Emojis.Arrow} /${command.name}: ${command.description}`
            );

            const chunks = []; // Dividir los comandos en bloques más pequeños
            for (let i = 0; i < commandsArray.length; i += commandsPerField) {
                chunks.push(commandsArray.slice(i, i + commandsPerField));
            }

            const embed = new EmbedBuilder()
                .setTitle("Lista de Comandos:")
                .setDescription("Aquí tienes la lista de comandos disponibles:")
                .setColor(0xFFFF00);

            chunks.forEach((chunk, index) => {
                embed.addFields({
                    name: ` `,
                    value: chunk.join("\n"),
                });
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                await interaction.editReply({ content: "Ocurrió un error al ejecutar el comando." });
            } else {
                await interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
            }
        }
    },
};

import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionsBitField, GuildMemberRoleManager } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('mute')
  .setDescription('Silencia a un usuario en el servidor.')
  .addUserOption(option =>
    option.setName('usuario')
      .setDescription('El usuario que quieres silenciar')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('duracion')
      .setDescription('Duración del mute en minutos')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.options.getMember('usuario');
  const duration = interaction.options.getInteger('duracion');

  if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ModerateMembers)) {
    return interaction.reply({ content: 'No tienes permiso para silenciar miembros.', ephemeral: true });
  }

  if (!member || !(member.roles instanceof GuildMemberRoleManager)) {
    return interaction.reply({ content: 'No puedo silenciar a este miembro.', ephemeral: true });
  }

  await member.timeout(duration * 60 * 1000); // Convierte minutos a milisegundos
  return interaction.reply({ content: `El usuario ${member.user.tag} fue silenciado por ${duration} minutos.` });
}

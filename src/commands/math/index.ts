import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('math')
    .setDescription('Resuelve problemas matemáticos')
    .addStringOption(option =>
      option.setName('equation').setDescription('La ecuación matemática a resolver').setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const equation = interaction.options.getString('equation', true);

    try {
      const result = eval(equation); 
      await interaction.reply(`El resultado es: ${result}`);
    } catch (error) {
      await interaction.reply('Lo siento, no pude calcular eso.');
    }
  },
};

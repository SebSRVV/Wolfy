// src/commands/talk/talkDefine.ts
import { ChatInputCommandInteraction } from "discord.js";

const define = async (client: any, interaction: ChatInputCommandInteraction, term: string) => {
    // Aquí puedes implementar la lógica para buscar definiciones (por ejemplo, utilizando una API).
    const definition = `Definición de ${term}: ...`; // Simulación de definición
    await interaction.reply(definition);
};

export default define;

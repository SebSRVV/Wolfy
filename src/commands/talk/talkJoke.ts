// en desarollo
import { ChatInputCommandInteraction } from "discord.js";

const joke = async (client: any, interaction: ChatInputCommandInteraction) => {
    const jokes = [
        "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.",
        "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await interaction.reply(randomJoke);
};

export default joke;

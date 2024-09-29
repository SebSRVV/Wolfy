// en desarollo
import { ChatInputCommandInteraction } from "discord.js";

const quote = async (client: any, interaction: ChatInputCommandInteraction) => {
    const quotes = [
        "La vida es lo que pasa mientras estás ocupado haciendo otros planes. – John Lennon",
        "No cuentes los días, haz que los días cuenten. – Muhammad Ali",
        "La vida es corta, sonríe mientras tengas dientes.",

    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    await interaction.reply(randomQuote);
};

export default quote;

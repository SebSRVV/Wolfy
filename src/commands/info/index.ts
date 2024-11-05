import {
    ApplicationCommandType,
    EmbedBuilder,
    Colors,
} from "discord.js";
import { CommandInterface } from "@/src/types/Command";
import memberSchema from "@schemas/Member";
import { PetTypes } from "@/src/enums";

// Objeto que asocia cada tipo de mascota con su URL de imagen
const petImages: { [key in PetTypes]: string } = {
    [PetTypes.Wolf]: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhGtXrj1i7ZBs3QeR5ywC78wi8G10NSxE0Gg5N6aubF9M7M3dZMZaZ6rC3SJer_800lvxMoHBF846lKuFHHlaUA14rSZJpfrfJZ4sNlRbGLARvWfj5oAWDBwpbLF3yVeNk4-GdH/s320/wolf.jpg',
    [PetTypes.Cat]: 'https://img.freepik.com/fotos-premium/pintura-gato-mirando-encima-caja-madera_849761-3847.jpg',
    [PetTypes.Dog]: 'https://img.freepik.com/fotos-premium/perro-dibujos-animados-sentado-mesa_881695-23543.jpg',
    [PetTypes.Rabbit]: 'https://img.freepik.com/fotos-premium/conejo-lindo-corbata_21085-124770.jpg',
    [PetTypes.Bird]: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0d8a1d68-4f37-4b4d-a037-52cd7913364b/dgcuayi-8d90cb57-c6f3-4208-a8e0-75704602d1bd.jpg/v1/fill/w_1280,h_1280,q_75,strp/enchanting_miniature_raven_by_saifulmiqdar_dgcuayi-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzBkOGExZDY4LTRmMzctNGI0ZC1hMDM3LTUyY2Q3OTEzMzY0YlwvZGdjdWF5aS04ZDkwY2I1Ny1jNmYzLTQyMDgtYThlMC03NTcwNDYwMmQxYmQuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.7h6KVcBoi7f4zfelsRf7Ru18s34m4wUkxGzyuanuFfI',
};

export const command: CommandInterface = {
    name: "info",
    description: "Muestra la información de tu mascota.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        // Buscar el miembro en la base de datos
        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });
        
        // Embed cuando no hay cuenta
        if (!member) {
            const noAccountEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("❌ ¡Sin Cuenta Registrada!")
                .setDescription("No tienes una cuenta registrada. Usa el comando de registro primero.")
                .setFooter({ text: "¡Regístrate para empezar a adoptar!" })
                .setTimestamp();

            return await interaction.reply({ embeds: [noAccountEmbed], ephemeral: true });
        }

        // Verificar si el miembro tiene una mascota
        if (!member.pet) {
            const noPetEmbed = new EmbedBuilder()
                .setColor(Colors.Yellow)
                .setTitle("🐾 ¡Sin Mascota Adoptada!")
                .setDescription("No tienes una mascota adoptada. Usa el comando de adopción para conseguir una.")
                .setFooter({ text: "¡Adopta a una mascota y empieza la aventura!" })
                .setTimestamp();

            return await interaction.reply({ embeds: [noPetEmbed], ephemeral: true });
        }

        // Obtener la URL de la imagen de la mascota en base a su tipo
        const petImage = petImages[member.pet.type];

        // Crear un embed para mostrar la información de la mascota
        const petEmbed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(`✨ Información de tu Mascota`)
            .setDescription(`Aquí tienes los detalles de tu mascota adoptada:`)
            .setThumbnail(petImage)
            .addFields(
                { name: "🦮 Nombre", value: member.pet.name ?? "Sin nombre", inline: true },
                { name: "🐶 Raza", value: member.pet.type ?? "Desconocido", inline: true },
                { name: "🏅 Rango de Entrenador", value: member.rank ?? "Novato", inline: true },
                { name: "⚡ Experiencia", value: `${member.pet.xp ?? 0} XP`, inline: true },
                { name: "🍖 Cinammons Comidos", value: `${member.money.food.reduce((acc, food) => acc + food.amount, 0) ?? 0} Cinammons`, inline: true },
                { name: "📅 Tiempo con el Usuario", value: `${Math.floor((Date.now() - member.createdAt.getTime()) / (1000 * 60 * 60 * 24)) ?? 0} días`, inline: true }
            )
            .setImage(petImage) // Imagen de la mascota
            .setFooter({ text: "¡Cuida bien de tu mascota!" })
            .setTimestamp();

        // Responder al usuario con la información de la mascota
        await interaction.reply({ embeds: [petEmbed] });
    }
};

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
    name: "adopt",
    description: "Adopta una mascota y dale un nombre.",
    type: ApplicationCommandType.ChatInput,

    async run(client, interaction) {
        // Obtener el nombre de la mascota y el tipo de mascota de los argumentos del comando
        const petName = interaction.options.getString("nombre");
        const petType = interaction.options.getString("mascota"); // Asegúrate de que el comando tenga una opción para mascota

        // Validar el nombre de la mascota
        if (!petName || petName.length < 1 || petName.length > 20) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription("❌ El nombre de la mascota debe tener entre 1 y 20 caracteres.")
                ],
                ephemeral: true,
            });
        }

        // Validar el tipo de mascota
        if (!petType || !["lobo", "gato", "perro", "conejo", "ave"].includes(petType.toLowerCase())) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription("❌ Por favor, elige una mascota válida: lobo, gato, perro, conejo o ave.")
                ],
                ephemeral: true,
            });
        }

        // Asignar el tipo de mascota según la entrada
        let selectedPet: PetTypes;
        switch (petType.toLowerCase()) {
            case "lobo":
                selectedPet = PetTypes.Wolf;
                break;
            case "gato":
                selectedPet = PetTypes.Cat;
                break;
            case "perro":
                selectedPet = PetTypes.Dog;
                break;
            case "conejo":
                selectedPet = PetTypes.Rabbit;
                break;
            case "ave":
                selectedPet = PetTypes.Bird;
                break;
            default:
                return; // Esto no debería suceder debido a la validación anterior
        }

        // Guardar la mascota en la base de datos o en el esquema de miembro
        const member = await memberSchema.findOne({ "discord.id": interaction.user.id });
        if (!member) {
            return await interaction.reply({
                content: "No tienes una cuenta registrada. Usa el comando de registro primero.",
                ephemeral: true,
            });
        }

        // Asignar la mascota
        member.pet = {
            name: petName,
            type: selectedPet,
            xp: 0,
            level: 1,
            feed: 0, // Inicializa la cantidad de comida que ha recibido
            time: new Date(), // Inicializa el tiempo con el usuario
        };
        await member.save();

        // Responder con el resultado de la adopción
        const petImage = petImages[selectedPet]; // Obtener la imagen de la mascota
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle(`🎉 ¡Has adoptado a **${petName}**!`)
                    .setDescription(`¡Cuídalo bien! 🐾`)
                    .setThumbnail(petImage) // Usar la imagen de la mascota
            ],
            ephemeral: true,
        });
    }
};

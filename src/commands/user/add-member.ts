import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember } from "discord.js";
import memberSchema, { MemberRanks } from "@/src/database/schemas/Member";
import { Client } from "@/src/lib/classes";

const addMember = async (client: Client, interaction: ChatInputCommandInteraction) => {
    try {
        const selected = interaction.options.getUser("user");
        if (!selected) return interaction.reply({ content: "Usuario no encontrado.", ephemeral: true });

        const role = interaction.options.getString("rank") as MemberRanks; // Casting directamente a MemberRanks

        // Verificar si el rango es válido
        if (!Object.values(MemberRanks).includes(role)) {
            return interaction.reply({ content: "Rango inválido. Debe ser uno de los siguientes: Novice, Trainner, Master.", ephemeral: true });
        }

        // Verificar si el usuario ya está registrado
        const user = await memberSchema.findOne({ "discord.id": selected.id });
        if (user) return interaction.reply({ content: "El usuario ya está registrado.", ephemeral: true });

        // Crear nuevo miembro
        const newMember = new memberSchema({
            discord: {
                id: selected.id,
                username: selected.username
            },
            money: {
                available: [],
                hold: []
            },
            rank: role,
        });

        // Guardar en la base de datos
        await newMember.save();

        // Obtener el miembro del servidor (GuildMember)
        const member = await interaction.guild?.members.fetch(selected.id);
        if (!member) {
            return interaction.reply({ content: "No se pudo encontrar al usuario en el servidor.", ephemeral: true });
        }

        // Asignar el rol con ID "1287977821062561792"
        const roleID = "1287977821062561792";
        await member.roles.add(roleID).catch(error => {
            console.error(`Error asignando el rol: ${error}`);
            return interaction.reply({ content: "Ocurrió un error al asignar el rol.", ephemeral: true });
        });

        // Mensaje de éxito
        interaction.reply({ content: `Usuario añadido correctamente y se le ha asignado el rol.`, ephemeral: true });
    } catch (error) {
        console.error(error);
        interaction.reply({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
    }
};

export default addMember;

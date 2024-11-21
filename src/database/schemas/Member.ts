import { Schema, model } from "mongoose";

export enum MemberRanks {
    Novice = "novice",
    Trainer = "trainer",
    Master = "master",
    Legend = "legend" // Nivel adicional opcional
}

export enum PetTypes {
    Wolf = "wolf",
    Cat = "cat",
    Dog = "dog",
    Rabbit = "rabbit",
    Bird = "bird",
    Dragon = "dragon", // Mascota especial opcional
    Fox = "fox" // Otro tipo agregado
}

export interface IPet {
    name: string;
    type: PetTypes;
    rarity: "common" | "rare" | "epic" | "legendary"; // Rareza mejor tipada
    xp: number;
    level: number;
    feed: number;
    starsEarned: number;
    time: Date; // Fecha de adopción
}

export interface IMember {
    discord: {
        id: string;
        username: string;
        category: { type: String, required: false }, 
        channel: { type: String, required: false }, 
    };
    money: {
        economy: {
            amount: number;
            reason: string;
            date: Date;
        }[];
        food: {
            amount: number;
            reason: string;
            date: Date;
        }[];
    };
    logs: {
        reason: string;
        date: Date;
        by: string; // Quién realizó la acción
    }[];
    rank: MemberRanks; // Rango del usuario
    hide: boolean; // Si el usuario quiere ocultar su perfil
    pet?: IPet; // Mascota, opcional si no ha adoptado
    achievements?: string[]; // Lista de logros desbloqueados
    createdAt: Date;
    updatedAt: Date;
}

const petSchema = new Schema<IPet>(
    {
        name: { type: String, required: true, default: "Sin nombre" },
        type: { type: String, enum: Object.values(PetTypes), required: true },
        rarity: {
            type: String,
            enum: ["common", "rare", "epic", "legendary"],
            required: true,
            default: "common"
        },
        xp: { type: Number, required: true, default: 0 },
        level: { type: Number, required: true, default: 1 },
        feed: { type: Number, required: true, default: 0 },
        starsEarned: { type: Number, required: true, default: 0 },
        time: { type: Date, required: true, default: Date.now },
    },
    { _id: false } // No se generará un ID para subdocumentos de mascotas
);

const memberSchema = new Schema<IMember>(
    {
        discord: {
            id: { type: String, required: true, unique: true },
            username: { type: String, required: true },
        },
        money: {
            economy: [
                {
                    amount: { type: Number, required: true },
                    reason: { type: String, required: true },
                    date: { type: Date, required: true, default: Date.now }
                }
            ],
            food: [
                {
                    amount: { type: Number, required: true },
                    reason: { type: String, required: true },
                    date: { type: Date, required: true, default: Date.now }
                }
            ]
        },
        logs: [
            {
                reason: { type: String, required: true },
                date: { type: Date, required: true, default: Date.now },
                by: { type: String, required: true }
            }
        ],
        rank: {
            type: String,
            enum: Object.values(MemberRanks),
            required: true,
            default: MemberRanks.Novice
        },
        hide: {
            type: Boolean,
            required: true,
            default: false
        },
        pet: {
            type: petSchema, // Referencia al subesquema de mascotas
            required: false
        },
        achievements: {
            type: [String],
            required: false,
            default: [] // Lista de logros
        }
    },
    {
        timestamps: true, // Incluye createdAt y updatedAt automáticamente
        versionKey: false // Oculta el __v (versión del documento)
    }
);

export default model<IMember>("members", memberSchema);

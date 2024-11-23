import { Schema, model } from "mongoose";

// Enumeración de rangos de usuario
export enum MemberRanks {
    Novice = "novice",
    Trainer = "trainer",
    Master = "master",
    Legend = "legend",
}

// Enumeración de tipos de mascotas
export enum PetTypes {
    Wolf = "wolf",
    Cat = "cat",
    Dog = "dog",
    Rabbit = "rabbit",
    Bird = "bird",
    Dragon = "dragon",
    Fox = "fox",
}

// Interfaz para estadísticas de la mascota
export interface IPetStats {
    health: number; // Vida de la mascota
    shield: number; // Escudo adicional
    attack: number; // Daño base de ataque
    agility: number; // Velocidad de ataque (ataques por segundo)
    critChance: number; // Probabilidad de golpe crítico (en %)
    critDamage: number; // Daño crítico adicional (en %)
}

// Interfaz para los ítems de la mascota
export interface IPetItem {
    id: number; // Identificador único del ítem
    name: string; // Nombre del ítem
    description: string; // Descripción del ítem
    effect: string; // Efecto que aplica el ítem
    rarity: "common" | "rare" | "epic" | "legendary"; // Rareza del ítem
    stats?: Partial<IPetStats>; // Estadísticas que mejora el ítem (opcional)
    type: string; // Categoría del ítem (helmet, weapon, etc.)
}

// Interfaz para la mascota
export interface IPet {
    name: string; // Nombre de la mascota
    type: PetTypes; // Tipo de mascota
    rarity: "common" | "rare" | "epic" | "legendary"; // Rareza de la mascota
    level: number; // Nivel de la mascota
    xp: number; // Experiencia acumulada
    feed: number; // Veces alimentada
    starsEarned: number; // Estrellas ganadas
    time: Date; // Fecha de adopción
    stats: IPetStats; // Estadísticas base de la mascota
    items: IPetItem[]; // Lista de ítems equipados o poseídos
}

// Interfaz para los datos de un miembro/usuario
export interface IMember {
    discord: {
        id: string; // ID del usuario en Discord
        username: string; // Nombre de usuario en Discord
    };
    money: {
        economy: {
            amount: number; // Cantidad de estrellas
            reason: string; // Razón por la que se otorgaron/restaron
            date: Date; // Fecha del cambio
        }[];
        food: {
            amount: number; // Cantidad de comida
            reason: string; // Razón por la que se otorgó/restó
            date: Date; // Fecha del cambio
        }[];
    };
    logs: {
        reason: string; // Razón del registro
        date: Date; // Fecha del registro
        by: string; // Quién realizó la acción
    }[];
    rank: MemberRanks; // Rango del usuario
    hide: boolean; // Si el perfil está oculto
    pet?: IPet; // Mascota asociada (opcional)
    achievements?: string[]; // Lista de logros desbloqueados (opcional)
    createdAt: Date; // Fecha de creación del documento
    updatedAt: Date; // Fecha de actualización del documento
}

// Esquema para estadísticas de la mascota
const petStatsSchema = new Schema<IPetStats>(
    {
        health: { type: Number, required: true, default: 100 }, // Vida inicial
        shield: { type: Number, required: true, default: 10 }, // Escudo inicial
        attack: { type: Number, required: true, default: 5 }, // Ataque inicial
        agility: { type: Number, required: true, default: 1 }, // Velocidad de ataque inicial
        critChance: { type: Number, required: true, default: 5 }, // Probabilidad crítica inicial
        critDamage: { type: Number, required: true, default: 20 }, // Daño crítico inicial
    },
    { _id: false } // No genera un ID para este subdocumento
);

// Esquema para los ítems de la mascota
const petItemSchema = new Schema<IPetItem>(
    {
        id: { type: Number, required: true }, // ID único del ítem
        name: { type: String, required: true }, // Nombre del ítem
        description: { type: String, required: true }, // Descripción del ítem
        effect: { type: String, required: true }, // Efecto que tiene el ítem
        rarity: {
            type: String,
            enum: ["common", "rare", "epic", "legendary"],
            required: true,
            default: "common",
        }, // Rareza del ítem
        stats: { type: petStatsSchema, required: false }, // Estadísticas que mejora
        type: { type: String, required: true }, // Categoría del ítem
    },
    { _id: false } // No genera un ID para este subdocumento
);

// Esquema para la mascota
const petSchema = new Schema<IPet>(
    {
        name: { type: String, required: true, default: "Sin nombre" },
        type: { type: String, enum: Object.values(PetTypes), required: true },
        rarity: {
            type: String,
            enum: ["common", "rare", "epic", "legendary"],
            required: true,
            default: "common",
        }, // Rareza de la mascota
        level: { type: Number, required: true, default: 1 }, // Nivel inicial
        xp: { type: Number, required: true, default: 0 }, // Experiencia inicial
        feed: { type: Number, required: true, default: 0 }, // Veces alimentada
        starsEarned: { type: Number, required: true, default: 0 }, // Estrellas iniciales
        time: { type: Date, required: true, default: Date.now }, // Fecha de adopción
        stats: { type: petStatsSchema, required: true, default: () => ({}) }, // Estadísticas iniciales
        items: { type: [petItemSchema], required: true, default: [] }, // Ítems iniciales (vacíos)
    },
    { _id: false } // No genera un ID para este subdocumento
);

// Esquema para los datos del usuario
const memberSchema = new Schema<IMember>(
    {
        discord: {
            id: { type: String, required: true, unique: true },
            username: { type: String, required: true },
        },
        money: {
            economy: {
                type: [
                    {
                        amount: { type: Number, required: true },
                        reason: { type: String, required: true },
                        date: { type: Date, required: true, default: Date.now },
                    },
                ],
                default: [], // Inicializa como un array vacío
            },
            food: {
                type: [
                    {
                        amount: { type: Number, required: true },
                        reason: { type: String, required: true },
                        date: { type: Date, required: true, default: Date.now },
                    },
                ],
                default: [], // Inicializa como un array vacío
            },
        },
        logs: {
            type: [
                {
                    reason: { type: String, required: true },
                    date: { type: Date, required: true, default: Date.now },
                    by: { type: String, required: true },
                },
            ],
            default: [], // Inicializa como un array vacío
        },
        rank: {
            type: String,
            enum: Object.values(MemberRanks),
            required: true,
            default: MemberRanks.Novice,
        },
        hide: {
            type: Boolean,
            required: true,
            default: false, // Perfil visible por defecto
        },
        pet: {
            type: petSchema,
            required: false, // Mascota es opcional
        },
        achievements: {
            type: [String],
            required: false,
            default: [], // Inicializa como un array vacío
        },
    },
    {
        timestamps: true, // Incluye automáticamente `createdAt` y `updatedAt`
        versionKey: false, // Oculta el campo `__v` de versión
    }
);

export default model<IMember>("members", memberSchema);

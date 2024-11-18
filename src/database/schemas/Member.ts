import { Schema, model } from "mongoose";

export enum MemberRanks {
    Novice = "novice",
    Trainer = "trainer",
    Master = "master"
}

export enum PetTypes {
    Wolf = "wolf",
    Cat = "cat",
    Dog = "dog",
    Rabbit = "rabbit",
    Bird = "bird"
}

export interface IPet {
    name: string;
    type: PetTypes;
    rarity: string;
    xp: number;
    level: number;
    feed: number;
    starsEarned: number;
    time: Date;
    image: string;
}

export interface IMember {
    discord: {
        id: string;
        username: string;
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
        by: string;
    }[];
    rank: MemberRanks;
    hide: boolean;
    pet: IPet; 
    createdAt: Date;
    updatedAt: Date;
}

const memberSchema: Schema<IMember> = new Schema(
    {
        discord: {
            id: { type: String, required: true },
            username: { type: String, required: true },
        },
        money: {
            economy: [
                {
                    amount: { type: Number, required: true },
                    reason: { type: String, required: true },
                    date: { type: Date, required: true }
                }
            ],
            food: [
                {
                    amount: { type: Number, required: true },
                    reason: { type: String, required: true },
                    date: { type: Date, required: true }
                }
            ]
        },
        logs: [
            {
                reason: { type: String, required: true },
                date: { type: Date, required: true },
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
            name: { type: String, required: false, default: "Sin nombre" },
            type: { type: String, enum: Object.values(PetTypes), required: false },
            rarity: { type: String, required: false, default: "Común" },
            xp: { type: Number, default: 0 },
            level: { type: Number, default: 1 },
            feed: { type: Number, default: 0 },
            starsEarned: { type: Number, default: 0 },
            time: { type: Date, default: Date.now }, // Fecha de adopción
            image: { type: String, required: false, default: "" } // Imagen de la mascota generada por IA
        }
    },
    {
        timestamps: true, // Incluye createdAt y updatedAt automáticamente
        versionKey: false
    }
);

export default model<IMember>("members", memberSchema);

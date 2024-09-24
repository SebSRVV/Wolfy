import { Schema, model } from "mongoose";

export interface PersonalitySchema {
    id: string;
    name: string;
    messages: string[]; 
    createdAt: Date;
    updatedAt: Date;
}

const personalitySchema: Schema<PersonalitySchema> = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        messages: {
            type: [String], 
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("Personality", personalitySchema);

import { Schema, model } from "mongoose";

const setupSchema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
}, { timestamps: true });

export default model("setup", setupSchema);

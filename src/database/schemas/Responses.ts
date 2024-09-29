// src/schemas/Responses.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IResponse extends Document {
    trigger: string;
    response: string;
    language: 'es' | 'en'; // Solo permite 'es' o 'en'
}

const responseSchema: Schema<IResponse> = new Schema({
    trigger: { type: String, required: true, unique: true },
    response: { type: String, required: true },
    language: { type: String, required: true, enum: ['es', 'en'] },
});

const ResponseModel = mongoose.model<IResponse>('Response', responseSchema);

export default ResponseModel;

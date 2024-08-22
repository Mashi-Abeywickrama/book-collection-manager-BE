import mongoose, { Schema, Document } from 'mongoose';
import { IGenre } from '../interface/dbInterfaces';

const GenreSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
});

export default mongoose.model<IGenre>('Genre', GenreSchema);

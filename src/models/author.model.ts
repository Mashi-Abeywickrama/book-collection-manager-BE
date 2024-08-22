import mongoose, { Schema, Document } from 'mongoose';
import { IAuthor } from '../interface/dbInterfaces';

const AuthorSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    bio: { type: String },
    birthDate: { type: Date },
    deathDate: { type: Date },
});

export default mongoose.model<IAuthor>('Author', AuthorSchema);

import { Schema, model } from 'mongoose';
import { IGenre } from '../interface/dbInterfaces';

const genreSchema =  new Schema({
    name: { type: String, required: true, unique: true },
});
const Genre = model<IGenre>('Genre', genreSchema);

export default Genre;

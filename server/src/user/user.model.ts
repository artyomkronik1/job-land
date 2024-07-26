import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },
    password: { type: String, required: false },
    email: { type: String, required: true },
    role: { type: String, required: true },
    follow: { type: Array, required: true },
    about: { type: String, required: false },
    experience: { type: String, required: false },
    education: { type: String, required: false },
    profilePicture: { type: String, required: false },
    backgroundPicture: { type: String, required: false }

})

export interface User {
    id: string;
    name: string;
    password: string;
    email: string;
    role: string;
    follow: string[];
    about: string;
    experience: string;
    education: string;
    profilePicture: string;
    backgroundPicture: string;


}
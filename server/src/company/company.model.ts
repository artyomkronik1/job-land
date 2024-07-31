import * as mongoose from 'mongoose';
import { Message, MessageSchema } from "../message/message.model";
import { Job } from 'src/job/job.model';
import { User } from 'src/user/user.model';

export const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    about: { type: String, required: false },
    jobs: { type: Array, required: true },
    workers: { type: Array, required: true },
    backgroundPicture: { type: String, required: false },
    profilePicture: { type: String, required: false },
    id: { type: String, required: false },
})

export interface Company {
    id: string;
    name: string;
    location: string;
    about: string;
    jobs: Job[]
    workers: User[];
    profilePicture: string;
    backgroundPicture: string;
}
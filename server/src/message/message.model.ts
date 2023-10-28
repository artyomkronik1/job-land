import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: {type:String, required:true},
    timestamp: {type:String, required:false},
});

export interface Message  {
    sender: string;
    receiver: string;
    content: string;
    timestamp: string;
}
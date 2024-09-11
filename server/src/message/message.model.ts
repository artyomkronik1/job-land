import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
    sender: {type:String, required:true},
    receiver: {type:String, required:true},
    content: {type:String, required:true},
    timestamp: {type:String, required:false},
});

export interface Message  {
    sender: string;
    receiver: string;
    content: string;
    timestamp: string;
}
import * as mongoose from 'mongoose';
import {Message, MessageSchema} from "../message/message.model";

export const ChatsSchema = new mongoose.Schema({
    messages:{type:Array, required:true},
    id:{type:String, required:false},
})

export interface Chat  {
    messages:Message[]
    id:string;
}

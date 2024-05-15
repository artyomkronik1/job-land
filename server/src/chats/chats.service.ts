import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Chat} from "./chat.model";
import {Post} from "../posts/post.model";
import {Message} from "../message/message.model";

@Injectable()
export class ChatsService {
    constructor(@InjectModel('Chat') private readonly chatsModel: Model<Chat>) {}

    //getChatsById
    async getChatsById(id:string){
        try {
            // Query the database to fetch chats by their ID
            const chat = await this.chatsModel.find({ _id: id });
            if(chat)
            {
                return{
                    success:true,
                    chat:chat,
                }
            }
            else{
                return {
                    success:false
                }
            }
        } catch (error) {
            throw new Error('Error fetching chats');
        }
}

    // addNewMessageToChatById
    async addNewMessageToChatById(id:string, msg:Message){
        try {
            let chat = await this.chatsModel.findByIdAndUpdate(id, { $push: { messages: msg } }, { new: true });
            if (chat) {
                return{
                    success:true,
                    chat:chat
                }
            } else {
                return{
                    success:false,
                    errorCode:"fail_to_find_chat"
                }
            }
        } catch (error) {
            return{
                success:false,
                errorCode:"fail_to_add_new_msg"
            }
        }

    }
    async getAllChats(){
            const chats:Chat[] = await this.chatsModel.find().exec();
            if (chats.length>0) {
                return {
                    success: true,
                    chats: chats,
                }
            } else{
                return {
                    success:false,
                    errorCode:"fail_to_find_chats"
                }
            }

    }
    async getChatsByUserId(userId:string){

        const chats = await this.chatsModel.find({
            messages: {
                $elemMatch: {
                    receiver: userId
                }
            }
        }).exec();
            if(chats.length>0){
                return {
                    success: true,
                    chats: chats,
                };
            }else {
                return {
                    success: false,
                    errorCode: 'fail_to_find_chats',
                };
            }
        }
}

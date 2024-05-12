import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Chat} from "./chat.model";
import {Post} from "../posts/post.model";
import {Message} from "../message/message.model";

@Injectable()
export class ChatsService {
    constructor(@InjectModel('Chat') private readonly chatsModel: Model<Chat>) {}

    // addNewMessageToChatById
    async addNewMessageToChatById(id:string, msg:Message){
        try {
            let chat = await this.chatsModel.findByIdAndUpdate(id, { $push: { messages: msg } }, { new: true });
            if (chat) {
                console.log(chat);
                return{
                    success:true,
                    chat:chat
                }
            } else {
                console.error('Chat not found');
                return{
                    success:false,
                    errorCode:"fail_to_find_chat"
                }
            }
        } catch (error) {
            console.error('Error adding message to chat:', error);
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

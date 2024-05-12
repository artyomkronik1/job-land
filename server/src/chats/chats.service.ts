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
        let chat = await this.chatsModel.findById(id);
        console.log(chat)

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

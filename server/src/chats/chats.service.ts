import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Chat} from "./chat.model";
import {Post} from "../posts/post.model";

@Injectable()
export class ChatsService {
    constructor(@InjectModel('Chat') private readonly chatsModel: Model<Chat>) {}
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
            console.log('get', userId)

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

import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Chat} from "./chat.model";

@Injectable()
export class ChatsService {
    constructor(@InjectModel('Chat') private readonly chatsModel: Model<Chat>) {}
    async getChatsByUserId(userId:string){
            console.log('get', userId)

        const chats = await this.chatsModel.find({
            messages: {
                $elemMatch: {
                    userId: userId.toString() // Search for userId within the messages array
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

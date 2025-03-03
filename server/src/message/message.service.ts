import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message} from "./message.model";

@Injectable()
export class MessageService {
    constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) {}

    async sendMessage(senderId: string, receiverId: string, content: string, timestamp:string): Promise<Message> {
        const message = new this.messageModel({ sender: senderId, receiver: receiverId, content,timestamp });
        return await message.save();
    }
    // return all messages between only 2 persons
    async getMessagesBy2(senderId: string, receiverId: string)
    {
        const messages=  await this.messageModel
            .find({
                $or: [
                    { sender: senderId },
                    { receiver: senderId },
                    { sender: receiverId },
                    { receiver: receiverId },
                ],
            })
            .exec();
        if(messages.length>0){
            return {
                success: true,
                messages: messages,
            };
        }else {
            return {
                success: false,
                errorCode: 'fail_to_find_messages',
            };
        }
    }

    async getMessages(senderId: string, receiverId: string) {
        const messages=  await this.messageModel
            .find({ sender: senderId, receiver: receiverId })
            .sort({ timestamp: 'asc' })
            .exec();
        if(messages.length>0){
            return {
                success: true,
                messages: messages,
            };
        }else {
            return {
                success: false,
                errorCode: 'fail_to_find_messages',
            };
        }
    }
    // get all messages was sent or received by this user

    async getMessagesById(userId: string){

        const messages = await this.messageModel.find({
            $or: [
                { sender: userId.toString() },   // Messages sent by the user
                { receiver: userId.toString()    }  // Messages received by the user
            ]
        }).exec();
        if(messages.length>0){
            return {
                success: true,
                messages: messages,
            };
        }else {
            return {
                success: false,
                errorCode: 'fail_to_find_messages',
            };
        }
    }


}

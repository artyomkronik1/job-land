
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import {MessageService} from "./message.service";
import { Message } from './message.model';

@Controller('messages')
export class MessageController {
    constructor(private messageService: MessageService) {}

    // send msg
    @Post(':senderId/:receiverId')
    async sendMessage(
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string,
        @Body('content') content: string,
        @Body('timestamp') timestamp: string,
    ): Promise<Message> {
        return this.messageService.sendMessage(senderId, receiverId, content,timestamp);
    }
    //get msg
    @Get(':senderId/:receiverId')
    async getMessages(
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string,
    ) {
        return this.messageService.getMessages(senderId, receiverId);
    }
    // get all msg between 2 people only
    // @Post('/')
    // async getMessagesBy2(@Body('receiverId') receiverId: string, @Body('senderId') senderId: string) {
    //     return this.messageService.getMessagesBy2(senderId,receiverId);
    // }

    // get all messages that got or sent by this user
    @Post()
    async getReceiveById(@Body('receiverId') receiverId: string) {
        return this.messageService.getMessagesById(receiverId);
    }
}
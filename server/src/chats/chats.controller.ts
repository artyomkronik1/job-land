import {Body, Controller, Get,Post} from '@nestjs/common';
import {ChatsService} from "./chats.service";
import {Message} from "../message/message.model";
@Controller('chats')
export class ChatsController {
    constructor(private chatsService: ChatsService) {}
    @Post()
    async getChatsByUserId(@Body('id') id: string) {
        return this.chatsService.getChatsByUserId(id);
    }

    @Post('/sendmsg')
    async addNewMessageToChatById(@Body('chatid') id: string, @Body('msg') message: Message) {
        return this.chatsService.addNewMessageToChatById(id, message);
    }

    @Get()
    async getAllChats() {
        return this.chatsService.getAllChats();
    }
}

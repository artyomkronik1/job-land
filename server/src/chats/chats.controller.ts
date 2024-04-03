import {Body, Controller, Get,Post} from '@nestjs/common';
import {ChatsService} from "./chats.service";
@Controller('chats')
export class ChatsController {
    constructor(private chatsService: ChatsService) {}
    @Post()
    async getChatsByUserId(@Body('id') id: string) {
        return this.chatsService.getChatsByUserId(id);
    }

    @Get()
    async getAllChats() {
        return this.chatsService.getAllChats();
    }
}

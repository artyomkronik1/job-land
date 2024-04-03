import {Body, Controller, Get,Post} from '@nestjs/common';
import {ChatsService} from "./chats.service";
@Controller('chats')
export class ChatsController {
    constructor(private chatsService: ChatsService) {}
    @Post()
    async getChatsByUserId(@Body('userId') userId: string) {
        return this.chatsService.getChatsByUserId(userId);
    }
}

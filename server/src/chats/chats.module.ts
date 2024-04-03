import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";

import {ChatsSchema} from "./chat.model";
import {ChatsController} from "./chats.controller";
import {ChatsService} from "./chats.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatsSchema }])],
    controllers: [ChatsController],
    providers: [ChatsService]
})
export class ChatsModule {}

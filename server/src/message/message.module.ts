import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import {MongooseModule} from "@nestjs/mongoose";
import {MessageSchema} from "./message.model";
import {MessageController} from "./message.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}

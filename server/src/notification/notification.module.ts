import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MongooseModule } from "@nestjs/mongoose";

import { NotificationSchema } from "./notification.model";

@Module({
	imports: [MongooseModule.forFeature([{ name: 'notification', schema: NotificationSchema }])],
	controllers: [NotificationController],
	providers: [NotificationService]
})
export class NotificationModule { }

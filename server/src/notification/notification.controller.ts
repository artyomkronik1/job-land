import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from "./notification.service";

@Controller('notifications')
export class NotificationController {
	constructor(private postService: NotificationService) {
	}


}

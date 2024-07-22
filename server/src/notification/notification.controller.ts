import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from "./notification.service";

@Controller('notifications')
export class NotificationController {
	constructor(private notificationService: NotificationService) { }

	// get all notifications
	@Post()
	async getAllNotificationsByUserId(@Body() data: any) {
		return this.notificationService.getAllNotificationsByUserId(data);
	}

	@Post('/new')
	async addNotification(@Body() data: any) {
		return this.notificationService.addNotification(data);
	}
}

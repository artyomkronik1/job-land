import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from "./notification.service";

@Controller('notifications')
export class NotificationController {
	constructor(private notificationService: NotificationService) { }


	@Post('/remove')
	async removeNotification(@Body() data: any) {
		return this.notificationService.removeNotification(data);
	}
	@Post()
	async getAllNotificationsByUserId(@Body() data: any) {
		return this.notificationService.getAllNotificationsByUserId(data);
	}

	@Post('/new')
	async addNotification(@Body() data: any) {
		return this.notificationService.addNotification(data);
	}
}

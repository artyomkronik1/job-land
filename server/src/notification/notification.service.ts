import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { notification } from './notification.model';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('notification') private readonly notificationModel: Model<notification>) { }
	// add
	async addNotification(notification: any) {
		console.log(notification);

		const newNot = new this.notificationModel({
			message: notification.not.message,
			to: notification.not.to,
			time: notification.not.time
		});
		const result = await newNot.save();
		if (result) {
			return {
				success: true,
				notification: {
					id: newNot.id,
					message: newNot.message,
					to: newNot.to,
					time: newNot.time

				},
			};
		} else {
			return {
				success: false,
				errorCode: 'fail_to_make_notification',
			};
		}
	}


	// get
	async getAllNotificationsByUserId(data: any) {
		const notifications = await this.notificationModel.find({ to: data.id.toString() }).exec();
		if (notifications.length > 0) {
			return {
				success: true,
				notifications: notifications,
			}
		} else {
			return {
				success: false,
				errorCode: "fail_to_find_notifications"
			}
		}
	}

}

import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { notification } from './notification.model';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('notification') private readonly notificationModel: Model<notification>) { }
	// add
	async addNotification(notification: any) {

		// Define a query to check if a notification with the same unique attributes already exists
		const existingNotification = await this.notificationModel.find({

			to: notification.not.to,
			link: notification.not.link,
			from: notification.not.from,
			type: notification.not.type
		}).exec();

		if (existingNotification.length > 0) {
			// If an existing notification is found, return a response indicating that it already exists
			return {
				success: false,
				errorCode: 'notification_already_exists',
			};
		}
		else {

			// If no existing notification is found, create and save the new notification
			const newNot = new this.notificationModel({
				message: notification.not.message,
				to: notification.not.to,
				time: notification.not.time,
				link: notification.not.link,
				from: notification.not.from,
				type: notification.not.type
			});

			try {
				const result = await newNot.save();
				return {
					success: true,
					notification: {
						id: newNot.id,
						message: newNot.message,
						to: newNot.to,
						time: newNot.time,
						link: newNot.link,
						type: newNot.type,
						from: newNot.from,
					},
				};
			} catch (error) {
				console.error('Error saving notification:', error);
				return {
					success: false,
					errorCode: 'fail_to_make_notification',
				};
			}
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

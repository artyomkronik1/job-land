// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import { Message } from "../interfaces/message";
import { Chat } from "../interfaces/chat";
import { notification } from '../interfaces/notification';


const BASE_URL: string = 'http://localhost:3002';

const NotificationService = {



	async addNotifications(not: notification): Promise<any> {

		try {
			const response: AxiosResponse<notification[]> = await axios.post<notification[]>(`${BASE_URL}/notifications/new`, { not });
			return response.data;
		} catch (error) {
			console.error('Error adding notifications:', error);
			return;
		}
	},

	async getNotifications(id: string): Promise<any> {

		try {
			const response: AxiosResponse<notification[]> = await axios.post<notification[]>(`${BASE_URL}/notifications`, { id });
			return response.data;
		} catch (error) {
			console.error('Error fetching notifications:', error);
			return [];
		}
	}
};

export default NotificationService;

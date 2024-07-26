// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import { Message } from "../interfaces/message";
import { Chat } from "../interfaces/chat";
import { UsersNotification } from '../interfaces/usersNotification';


const BASE_URL: string = 'http://localhost:3002';

const NotificationService = {


	async getAllNotifications() {
		try {
			const response: AxiosResponse<UsersNotification[]> = await axios.get<UsersNotification[]>(`${BASE_URL}/notifications`);
			return response.data;
		} catch (error) {
			console.error('Error removing notifications:', error);
			return;
		}
	},
	async removeNotifications(not: UsersNotification): Promise<any> {

		try {
			const response: AxiosResponse<UsersNotification[]> = await axios.post<UsersNotification[]>(`${BASE_URL}/notifications/remove`, { not });
			return response.data;
		} catch (error) {
			console.error('Error removing notifications:', error);
			return;
		}
	},

	async addNotifications(not: UsersNotification): Promise<any> {

		try {
			const response: AxiosResponse<UsersNotification[]> = await axios.post<UsersNotification[]>(`${BASE_URL}/notifications/new`, { not });
			return response.data;
		} catch (error) {
			console.error('Error adding notifications:', error);
			return;
		}
	},

	async getNotifications(id: string): Promise<any> {

		try {
			const response: AxiosResponse<UsersNotification[]> = await axios.post<UsersNotification[]>(`${BASE_URL}/notifications`, { id });

			return response.data;
		} catch (error) {
			console.error('Error fetching notifications:', error);
			return [];
		}
	}
};

export default NotificationService;

// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import {Message} from "../interfaces/message";
import {Chat} from "../interfaces/chat";



const BASE_URL: string = 'http://localhost:3002';

const MessageService = {
    async getMessages(receiverId: string): Promise<any> {

        try {
            const response: AxiosResponse<Chat[]> = await axios.post<Chat[]>(`${BASE_URL}/messages`, {
                receiverId

            });
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    }
};

export default MessageService;

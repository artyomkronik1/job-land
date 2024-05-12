// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import {Message} from "../interfaces/message";
import {Chat} from "../interfaces/chat";



const BASE_URL: string = 'http://localhost:3002';

const MessageService = {
    //send message
    async sendMessageToChat(chatid: string, msg: Message): Promise<any> {

        try {
            const response: AxiosResponse<Chat[]> = await axios.post<Chat[]>(`${BASE_URL}/chats/sendmsg`, {chatid:chatid, msg:msg});
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    },

    async getChatById(chatid: string): Promise<any> {

        try {
            const response: AxiosResponse<Chat[]> = await axios.post<Chat[]>(`${BASE_URL}/chats/id`, {id:chatid});
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    },

    // getchats by userid
    async getChatsByUserId(id: string): Promise<any> {

        try {
            const response: AxiosResponse<Chat[]> = await axios.post<Chat[]>(`${BASE_URL}/chats`, {id});
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    }
};

export default MessageService;

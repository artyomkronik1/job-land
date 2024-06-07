// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import {User} from "../interfaces/user";


const BASE_URL: string = 'http://localhost:3002';

const UserService = {

   async getUserById  (id:string): Promise<any> {
        try {
            return await axios.get('http://localhost:3002/users',{params:{id:id}});

        } catch (error) {
            console.error('Error getting users', error);
        }
    },
    async getUsers (): Promise<any> {
        try {
        return await axios.get('http://localhost:3002/users');
        } catch (error) {
            console.error('Error getting users:', error);
        }
    },

    async setUserInfo(user:User):Promise<any>{
        try {
            //sent
            return await axios.post('http://localhost:3002/users/user',{user:user});

        } catch (error) {
            console.error('Error getting users messages', error);
        }
    }

}


export default UserService;

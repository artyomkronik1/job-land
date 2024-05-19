// MessageService.ts
import axios, { AxiosResponse } from 'axios';


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
    }


}


export default UserService;

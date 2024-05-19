// MessageService.ts
import axios, { AxiosResponse } from 'axios';


const BASE_URL: string = 'http://localhost:3002';

const AuthService = {
    //send message
    async login(email: string, password: string) {
        try {
            const result = await axios.post('http://localhost:3002/users/login', {email: email, password: password});
            if (result.data.success) {

                return result.data;
            } else {
                return result.data;
            }
        } catch (error) {
            console.error('Error login:', error);
        }
    },

    async signup(name: string, password: string, email: string, role: string) {
        try {
            const result = await axios.post('http://localhost:3002/users/signup', {name, password, email, role});
            if (result.data.success) {
                return result.data;
            } else {
                return result.data;
            }
        } catch (error) {
            console.error('Error signup:', error);
        }
    },
}


export default AuthService;

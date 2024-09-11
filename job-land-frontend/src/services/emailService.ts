// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import {EmailProps} from "../interfaces/emailProps";


const BASE_URL: string = 'http://localhost:3002';

const EmailService = {
    //send message
    async apply(emailProps:EmailProps) {
        try {
            const result = await axios.post('http://localhost:3002/jobs/apply', {emailProps});
            if (result.data.success) {
                return result.data;
            } else {
                return result.data;
            }
        } catch (error) {
            console.error('Error applying:', error);
        }
    },


}


export default EmailService;

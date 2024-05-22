// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import {Job} from "../interfaces/job";


const BASE_URL: string = 'http://localhost:3002';

const JobService = {
    async postNewJob(job:Job) {
        try {
            const result = await axios.post('http://localhost:3002/jobs/new', {job});
            if (result.data.success) {
                return result.data;
            } else {
                return result.data;
            }
        } catch (error) {
            console.error('Error post new job:', error);
        }
    },

    async getAllJobs(filters:any){
        try {
            const result = await axios.post('http://localhost:3002/jobs' ,{properties:filters});
            console.log(result)
            if (result.data.success) {
                return result;
            } else {
                return result.data;
            }
        } catch (error) {
            console.error('Error get all jobs:', error);
        }
    }


}


export default JobService;

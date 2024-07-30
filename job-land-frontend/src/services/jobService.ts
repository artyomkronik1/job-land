// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import { Job } from "../interfaces/job";


const BASE_URL: string = 'http://localhost:3002';

const JobService = {

    async addApplicate(jobid: string, id: string) {
        try {
            const result = await axios.post('http://localhost:3002/jobs/apply', { jobid, id });
            if (result.data.success) {
                return result.data;
            } else {
                return result.data;
            }
        } catch (error) {
            console.error('Error apply new job:', error);
        }
    },
    async postNewJob(job: Job) {
        try {
            const result = await axios.post('http://localhost:3002/jobs/new', { job });
            if (result.data.success) {
                return result.data;
            } else {
                return result.data;
            }
        } catch (error) {
            console.error('Error post new job:', error);
        }
    },


    async editJob(job: Job) {
        try {
            const result = await axios.post('http://localhost:3002/jobs/edit', { job });
            if (result.data.success) {
                return result.data;
            } else {
                return result.data;
            }
        } catch (error) {
            console.error('Error edit  job:', error);
        }
    },

    async removeJob(job: Job) {
        try {
            const result = await axios.post('http://localhost:3002/jobs/remove', { job });
            if (result.data.success) {
                return result.data;
            } else {
                return result.data;
            }
        } catch (error) {
            console.error('Error edit  job:', error);
        }
    },

    async getAllJobs(filters: any) {
        try {
            const result = await axios.post('http://localhost:3002/jobs', { properties: filters });
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

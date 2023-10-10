import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Job} from './job.model'
@Injectable()
export class JobService {
    constructor(@InjectModel('Job') private readonly jobModel: Model<Job>) {}
    async postNewJob(job: Job) {
        console.log(job)
        const newJob = new this.jobModel({
            title: job.title,
            description:job.description,
            salary:job.salary,
            hire_manager_id:job.hire_manager_id
        });
        const result = await newJob.save();
        if (result) {
            return {
                success: true,
                job: {
                    title: newJob.title,
                    description:newJob.description,
                    salary:newJob.salary,
                    hire_manager_id:newJob.hire_manager_id
                },
            };
        } else {
            return {
                success: false,
        errorCode: '004',
            };
        }
    }
    public async getSingleJob(id: string) {
        const job = await this.jobModel.findById(id);
        if (job) {
            return {
                success: true,
                job: {
                    id: job.id,
                    title: job.title,
                    description:job.description,
                    salary:job.salary,
                    hire_manager_id:job.hire_manager_id
                },
            }
        } else{
            return {
                success:false,
                errorCode:"0044"
            }
    }
    }
    public async getAllJobs() {
        const jobs = await this.jobModel.find().exec();
        if (jobs && jobs.length > 0) {
            return {
                success: true,
                jobs: jobs.map((job:Job) => ({
                    id: job.id,
                    title: job.title,
                    description:job.description,
                    salary:job.salary,
                    hire_manager_id:job.hire_manager_id
                })),
            };
        } else {
            return {
                success: false,
                errorCode: '00041',
            };
        }
    }
}

import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Job} from './job.model'
@Injectable()
export class JobService {
    constructor(@InjectModel('Job') private readonly jobModel: Model<Job>) {}
    async postNewJob(job: Job) {
        const newJob = new this.jobModel({
            title: job.title,
            description:job.description,
            salary:job.salary,
            hire_manager_id:job.hire_manager_id,
            company_name:job.company_name,
            hire_name:job.hire_name
        });
        const result = await newJob.save();
        if (result) {
            return {
                success: true,
                job: {
                    title: newJob.title,
                    description:newJob.description,
                    salary:newJob.salary,
                    hire_manager_id:newJob.hire_manager_id,
                    company_name:newJob.company_name,
                    hire_name:newJob.hire_name
                },
            };
        } else {
            return {
                success: false,
        errorCode: 'fail_to_post_job',
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
                    hire_manager_id:job.hire_manager_id,
                    company_name:job.company_name,
                    hire_name:job.hire_name
                },
            }
        } else{
            return {
                success:false,
                errorCode:"fail_to_find_job"
            }
    }
    }
    // get all the jobs by who user follow for
    public async getAllJobs(followers:string[]) {
        const jobs = await this.jobModel.find({ hire_manager_id: { $in: followers } }).exec();
        if (jobs && jobs.length > 0) {
            return {
                success: true,
                jobs: jobs.map((job:Job) => ({
                    id: job.id,
                    title: job.title,
                    description:job.description,
                    salary:job.salary,
                    hire_manager_id:job.hire_manager_id,
                    company_name:job.company_name,
                    hire_name:job.hire_name
                })),
            };
        } else {
            return {
                success: false,
                errorCode: 'fail_to_find_jobs',
            };
        }
    }
}

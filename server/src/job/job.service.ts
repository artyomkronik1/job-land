import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Emailprops, Job, JobProperties} from './job.model'
import {EmailService} from "./email.service";
@Injectable()
export class JobService {
    constructor(@InjectModel('Job') private readonly jobModel: Model<Job>,    private readonly emailService: EmailService) {}

    async applyForJob(emailProps:Emailprops){
        console.log(emailProps)
        return await this.emailService.sendEmail(emailProps.to, emailProps.title, emailProps.description); // Customize email content as needed
    }
    async postNewJob(job: Job) {
        const newJob = new this.jobModel({
            title: job.title,
            description:job.description,
            salary:job.salary,
            hire_manager_id:job.hire_manager_id,
            company_name:job.company_name,
            hire_name:job.hire_name,
            zone:job.zone,
            profession:job.profession,
            region:job.region,
            manner:job.manner,
            experienced_level:job.experienced_level,
            scope:job.scope
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
                    hire_name:newJob.hire_name,
                    zone:newJob.zone,
                    profession:newJob.profession,
                    region:newJob.region,
                    manner:newJob.manner,
                    experienced_level:newJob.experienced_level,
                    scope:newJob.scope
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
                    hire_name:job.hire_name,
                    zone:job.zone,
                    profession:job.profession,
                    region:job.region,
                    manner:job.manner,
                    experienced_level:job.experienced_level,
                    scope:job.scope
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
    public async getAllJobsByFollow(followers:string[]) {
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
                    hire_name:job.hire_name,
                    zone:job.zone,
                    profession:job.profession,
                    region:job.region,
                    manner:job.manner,
                    experienced_level:job.experienced_level,
                    scope:job.scope
                })),
            };
        } else {
            return {
                success: false,
                errorCode: 'fail_to_find_jobs',
            };
        }
    }
//     get all jobs (not only by follow) by properties
    public async getJobsByProperties(properties:JobProperties)
    {
        const jobs:Job[] = await this.jobModel.find(properties).exec();
        if (jobs.length>0) {
            return {
                success: true,
                jobs: jobs,
            }
        } else{
            return {
                success:false,
                errorCode:"fail_to_find_jobs"
            }
        }
    }
    // get all jobs without any filter
    public async getAllJobs(){
        const jobs:Job[] = await this.jobModel.find().exec();
        if (jobs.length>0) {
            return {
                success: true,
                jobs: jobs,
            }
        } else{
            return {
                success:false,
                errorCode:"fail_to_find_jobs"
            }
        }
    }
}

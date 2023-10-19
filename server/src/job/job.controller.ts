import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JobService} from "./job.service";
import {Job} from "./job.model";

@Controller('jobs')
export class JobController {
    constructor(private jobService: JobService) {}
    @Post()
    async getAllJobs(@Body() data:any) {
            return this.jobService.getAllJobs(data.followers);
    }
    // async getSingleJob(@Body() data:any){
    //     return this.jobService.getSingleJob(data.id);
    // }

    @Post()
    async postNewJob(@Body() job:Job){
        return this.jobService.postNewJob(job)
    }
}

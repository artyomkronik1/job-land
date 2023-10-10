import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JobService} from "./job.service";
import {Job} from "./job.model";

@Controller('jobs')
export class JobController {
    constructor(private jobService: JobService) {}
    @Get()
    async getAllJobs(@Body() data: any) {
        if(data.id && data.id.length>0) {
            return this.jobService.getSingleJob(data.id);
        } else{
            return this.jobService.getAllJobs();
        }
    }

    @Post()
    async postNewJob(@Body() job:Job){
        return this.jobService.postNewJob(job)
    }
}

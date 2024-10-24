import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from "../user/user.service";
import { JobService } from "./job.service";
import { Emailprops, Job } from "./job.model";

@Controller('jobs')
export class JobController {
    constructor(private jobService: JobService) { }
    @Post()
    async getJobs(@Body() data: any) {
        if (data.followers) {
            return this.jobService.getAllJobsByFollow(data.followers);
        }
        else if (data.properties.zone || data.properties.profession || data.properties.region || data.properties.manner || data.properties.experienced_level || data.properties.scope) {
            return this.jobService.getJobsByProperties(data.properties)
        }
        else {
            return this.jobService.getAllJobs();
        }
    }
    @Get()
    async getAllJobs() {
        return this.jobService.getAllJobs();

    }
    @Post('/apply')
    async applyJob(@Body() props: any) {
        return this.jobService.applyForJob(props)

    }
    @Post('/new')
    async postNewJob(@Body() job: any) {
        return this.jobService.postNewJob(job)
    }

    //     apply for job


    // edit
    @Post('/edit')
    async post(@Body() job: any) {
        return this.jobService.editJob(job)
    }
    // remove
    @Post('/remove')
    async remove(@Body() job: any) {
        return this.jobService.removeJob(job)
    }


}

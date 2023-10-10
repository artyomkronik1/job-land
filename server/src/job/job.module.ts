import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "../user/user.model";
import {JobSchema} from "./job.model";

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }])],
  controllers: [JobController],
  providers: [JobService]
})
export class JobModule {}

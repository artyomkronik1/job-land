import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Job} from "../job/job.model";
import {Post} from "./post.model";

@Injectable()
export class PostsService {
    constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}
    public async getAllPosts(){
        const posts:Post[] = await this.postModel.find().exec();
        if (posts.length>0) {
            return {
                success: true,
                posts: posts,
            }
        } else{
            return {
                success:false,
                errorCode:"fail_to_find_posts"
            }
        }
    }
}

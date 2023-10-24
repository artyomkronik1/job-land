import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Post} from "./post.model";

@Injectable()
export class PostsService {
    constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}
    public async postNewPost(post:Post){
        const newPost = new this.postModel({
            title: post.title,
            description: post.description,
            employee_id:post.employee_id,
        });
        const result = await newPost.save();
        if (result) {
            return {
                success: true,
                post: {
                    id:newPost.id,
                    title: newPost.title,
                    description: newPost.description,
                    employee_id:newPost.employee_id,
                },
            };
        } else {
            return {
                success: false,
                errorCode: 'fail_to_post',
            };
        }
    }
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

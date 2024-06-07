import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Post} from "./post.model";

@Injectable()
export class PostsService {
    constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}
    public async getPostByUserName(name:string){
        const posts = await this.postModel.find({ writer_name: name }).exec();
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
    public async getPostByUserId(data:any){
        const posts = await this.postModel.find({ employee_id: data.id.toString() }).exec();
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


    public async editPost(post:any){

        let p = await this.postModel.findById(post.post._id.toString());
        if (!p) {
            // Handle the case where the user with the given ID is not found
            return {success: false, errorCode: 'fail_to_find_user',};
        } else {
            p.title = post.post.title
            p.description = post.post.description


            await p.save()
            return {success: true, post: p}
        }
    }
    public async postNewPost(post:Post){
        const newPost = new this.postModel({
            writer_name: post.writer_name,
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
                    writer_name: newPost.writer_name,
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

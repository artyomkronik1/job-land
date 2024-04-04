import {Body, Controller, Get,Post} from '@nestjs/common';
import {PostsService} from "./posts.service";
import {loginData} from "../user/user.controller";
@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService) {}

@Get()
    async getAllPosts(){
        return this.postService.getAllPosts();
}
    @Post()
    async getPostByUserId(@Body() data: any) {
            return this.postService.getPostByUserId(data);

    }
@Post()
    async pushNewPost(@Body() post:any)
        {
            return this.postService.postNewPost(post)
        }
}

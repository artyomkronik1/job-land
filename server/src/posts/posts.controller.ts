import {Body, Controller, Get,Post} from '@nestjs/common';
import {PostsService} from "./posts.service";
import {loginData} from "../user/user.controller";
@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService) {}
// get all posts
@Get()
    async getAllPosts(){
        return this.postService.getAllPosts();
}
// getPostByUserId
@Post()
    async getPostByUserId(@Body() data: any) {
            return this.postService.getPostByUserId(data);

    }
//     new post
@Post('/new')
    async pushNewPost(@Body() post:any)
        {
            return this.postService.postNewPost(post)
        }

    @Post('/edit')
    async post(@Body() post:any)
    {
        return this.postService.editPost(post)
    }
}

import {Body, Controller, Get,Post} from '@nestjs/common';
import {PostsService} from "./posts.service";
import {loginData} from "../user/user.controller";
import {Message} from "../message/message.model";
import {comment} from "./post.model";
@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService) {
    }

// get all posts
    @Get()
    async getAllPosts() {
        return this.postService.getAllPosts();
    }

// getPostByUserId
    @Post()
    async getPostByUserId(@Body() data: any) {
        return this.postService.getPostByUserId(data);

    }

//     new post
    @Post('/new')
    async pushNewPost(@Body() post: any) {
        return this.postService.postNewPost(post)
    }

    @Post('/edit')
    async post(@Body() post: any) {
        return this.postService.editPost(post)
    }


    @Post('/comment')
    async addComment(@Body('post') post: any, @Body('comment') comment: comment )
        {
            return this.postService.addComment(post, comment)
        }
    @Post('/comment/update')
    async updateCommentOnPost(@Body('post') post: any, @Body('comment') comment: comment )
    {
        return this.postService.updateCommentOnPost(post, comment)
    }
    @Post('/comment/remove')
    async removeCommentOnPost(@Body('post') post: any, @Body('comment') comment: comment )
    {
        return this.postService.removeCommentOnPost(post, comment)
    }
    @Post('/like')
    async likedPost(@Body('post') post: any, @Body('like') like: boolean,  @Body('user') user: string) {
        {
            return this.postService.likePost(post, like, user)
        }


    }

}

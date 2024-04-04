// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import {Message} from "../interfaces/message";
import {Chat} from "../interfaces/chat";
import {Post} from "../interfaces/post";
import UserStore from "../store/user";


const PostsService = {
    async getAllPosts(): Promise<any> {
        try {
            const result = await axios.get('http://localhost:3002/posts');
            if(result.data.success) {
                // filter only the posts user follow or itself posts
                const postsFollowedbyUser = result.data.posts.filter((post: Post) => {
                    return UserStore.user.follow.includes(post.employee_id) || UserStore.user.id == post.employee_id ;
                });
                return postsFollowedbyUser.reverse()
            }
            else{

                return []

            }
        } catch (error) {
            return []
            console.error('Error get posts:', error);
        }
    }
};

export default PostsService;

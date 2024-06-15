// MessageService.ts
import axios, { AxiosResponse } from 'axios';
import {Message} from "../interfaces/message";
import {Chat} from "../interfaces/chat";
import {Post} from "../interfaces/post";
import UserStore from "../store/user";
import User from "../store/user";


const PostsService = {



    async savePost(post:Post) :Promise<any> {
        try {
            const result = await axios.post('http://localhost:3002/posts/edit', {post});
            if (result.data.success) {
                return result.data

            } else {

                return []

            }
        } catch (error) {
            return []
            console.error('Error post posts:', error);
        }

    },

    async  getPostByUserId  (user:any):Promise<any>{
        try {
            //sent
           return await axios.post('http://localhost:3002/posts',{id:user.id});
        } catch (error) {
            console.error('Error getting users messages', error);
        }
    },
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
    },
    async getPostById(id:string): Promise<any> {
        try {
            const result = await axios.post('http://localhost:3002/posts', {id:id});
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

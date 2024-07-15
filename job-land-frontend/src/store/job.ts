import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import { create, persist } from "mobx-persist";
import { Job } from "../interfaces/job";
import { Post } from "../interfaces/post";
import { comment } from "../interfaces/comment";

import axios from "axios";
import UserStore from "./user";
import jobService from "../services/jobService";
import postService from "../services/postService";
import PostsService from "../services/postService";
const hydrate = create({
    storage: localStorage,
    jsonify: true
})
class JobsStore {
    @persist('object') @observable filterJobs: Job[] = [];
    @persist('object') @observable followPost: Post[] = [];
    constructor() {
        makeAutoObservable(this);
    }
    // jobs that user follow for
    getfollowJobs() {
        return this.followPost
    }
    setfollowPosts(jobs: Post[]) {
        this.followPost = jobs
    }
    // jobs on job page
    getfilterJobs() {
        return this.filterJobs
    }
    setfilterJobs(jobs: Job[]) {
        this.filterJobs = jobs
    }

    getALlJobs = async () => {
        try {
            const result = await jobService.getAllJobs({})
            if (result.data.success) {
                this.setfilterJobs(result.data.jobs)

            }
            else {
                this.setfilterJobs([])
                return result.data

            }
        } catch (error) {
            this.setfollowPosts([])
            console.error('Error get jobs:', error);
        }
    }
    getPostInfoById = (id: string): any => {

        return this.followPost.find(post => post._id == id);
    }
    addApplicate = async (job: any, id: string) => {
        if (!job.applications.includes(id)) {
            job.applications.push(id);
            this.filterJobs.forEach((j: Job) => {
                if (j.id == job.id) {
                    j.applications.push(id)
                }
            })
            return jobService.addApplicate(job._id, id)

        }

    }
    editPost = async (postToEdit: Post) => {
        const res = await postService.savePost(postToEdit);
        if (res.success) {
            await this.getAllPosts();
        }
        return res;
    }
    removeComment = async (post: Post, comment: comment) => {
        post.comments = post.comments.filter((c) => c.id !== comment.id);

        this.followPost.map((posts: Post) => {
            if (posts._id == post._id) {
                posts = post
            }
        })
        // updating in server
        await postService.removeComment(comment, post._id)
        return post;
    }
    updateCommentForPost = async (post: Post, comment: comment) => {
        post.comments.map((c: comment) => {
            if (c.id == comment.id) {
                c.text = comment.text
            }
        })
        this.followPost.map((posts: Post) => {
            if (posts._id == post._id) {
                posts = post
            }
        })
        // updating in server
        await postService.saveUpdatedComment(comment, post._id)
    }
    addCommentOnPost = async (post: Post, comment: comment) => {
        post.comments.push(comment)
        this.followPost.map((posts: Post) => {
            if (posts._id == post._id) {
                posts = post
            }
        })
        // updating in server
        await postService.addComment(comment, post._id)
        return post;

    }

    setLikeOnPost = async (post: Post, user: string, like: boolean) => {
        // updating localy
        const index = post.likedBy.indexOf(user);

        if (!like && index === -1) {
            // Add user to likedBy array if not already liked
            post.likedBy.push(user);
        } else if (like && index !== -1) {
            // Remove user from likedBy array if already liked
            post.likedBy.splice(index, 1);
        }
        this.followPost.map((posts: Post) => {
            if (posts._id == post._id) {
                posts = post
            }
        })
        // updating in server
        await PostsService.setLikeOnPost(post, user, like)
    }

    getAllPosts = async () => {
        try {
            const result = await axios.get('http://localhost:3002/posts');
            if (result.data.success) {
                // filter only the posts user follow or itself posts
                const postsFollowedbyUser = result.data.posts.filter((post: Post) => {
                    return UserStore.user.follow.includes(post.employee_id) || UserStore.user.id == post.employee_id;
                });
                this.setfollowPosts(postsFollowedbyUser.reverse())
            }
            else {
                this.setfollowPosts([])
                return result.data

            }
        } catch (error) {
            this.setfollowPosts([])
            console.error('Error get posts:', error);
        }

    }
}

const jobsStore = new JobsStore();
export default jobsStore;

hydrate('jobsStore', jobsStore); // 'jobsStore' is the key under which your store will be stored


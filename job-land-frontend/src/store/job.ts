import {action, makeAutoObservable, makeObservable, observable} from "mobx";
import {create, persist} from "mobx-persist";
import {Job} from "../interfaces/job";
import {Post} from "../interfaces/post";
import axios from "axios";
import UserStore from "./user";
const hydrate = create({
    storage:localStorage,
    jsonify:true
})
class JobsStore{
    @persist('object') @observable filterJobs:Job[]=[];
    @persist('object') @observable followPost:Post[]=[];
    constructor() {
        makeAutoObservable(this);
    }
    // jobs that user follow for
    getfollowJobs(){
        return this.followPost
    }
    setfollowJobs(jobs:Post[]){
        this.followPost = jobs
    }
    // jobs on job page
    getfilterJobs(){
        return this.filterJobs
    }
    setfilterJobs(jobs:Job[]){
        this.filterJobs = jobs
    }

     getAllPosts=async()=>{
        try {
            const result = await axios.get('http://localhost:3002/posts');
            if(result.data.success) {
                // filter only the posts user follow or itself posts
                const postsFollowedbyUser = result.data.posts.filter((post: Post) => {
                    return UserStore.user.follow.includes(post.employee_id) || UserStore.user.id == post.employee_id ;
                });
                this.setfollowJobs(postsFollowedbyUser)
            }
            else{
                this.setfollowJobs([])
                return result.data

            }
        } catch (error) {
            this.setfollowJobs([])
            console.error('Error get posts:', error);
        }

    }
}

const jobsStore = new JobsStore();
export default jobsStore;

hydrate('jobsStore', jobsStore); // 'jobsStore' is the key under which your store will be stored


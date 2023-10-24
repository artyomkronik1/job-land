import {action, makeAutoObservable, makeObservable, observable} from "mobx";
import {create, persist} from "mobx-persist";
import {Job} from "../interfaces/job";
const hydrate = create({
    storage:localStorage,
    jsonify:true
})
class JobsStore{
    @persist('object') @observable filterJobs:Job[]=[];
    @persist('object') @observable followJobs:Job[]=[];
    constructor() {
        makeAutoObservable(this);
    }
    // jobs that user follow for
    getfollowJobs(){
        return this.followJobs
    }
    setfollowJobs(jobs:Job[]){
        this.followJobs = jobs
    }
    // jobs on job page
    getfilterJobs(){
        return this.filterJobs
    }
    setfilterJobs(jobs:Job[]){
        this.filterJobs = jobs
    }
}

const jobsStore = new JobsStore();
export default jobsStore;

hydrate('jobsStore', jobsStore); // 'jobsStore' is the key under which your store will be stored


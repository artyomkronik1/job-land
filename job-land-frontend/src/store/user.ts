import {action, makeAutoObservable, makeObservable, observable} from "mobx";
import axios from 'axios';
import {User} from "../interfaces/user";
import {create, persist} from "mobx-persist";
import jobsStore from "./job";
import {Message} from "../interfaces/message";
const hydrate = create({
    storage:localStorage,
    jsonify:true
})
class UserStore{
    @persist  language ="en";
    @persist loading=false;
    @persist loggedIn= false;
    @persist signedUp=true;
    @persist('object') @observable users:User[]=[];
    @persist('object') @observable messages:Message[]=[]
    @persist('object') @observable user:User={id:"",password:"",role:"",email:"", about:"",name:"", follow:[]};
    @persist session_key=localStorage.getItem('session_key')
    constructor() {
        makeAutoObservable(this);
    }
    getLoading(){
        return this.loading;
    }
    getMessages(){
        return this.messages
    }
    getUser(){
          return this.user
    }
    getLanguage(){
        return this.language
    }
    getSessionKey(){
          return this.session_key
    }
    getLoggedIn(){
        return this.loggedIn
    }
    getSignedUp(){
        return this.signedUp
    }
    setSignedUp(SignedUp:boolean){
        this.signedUp = SignedUp
    }
    setLoggedIn(loggedIn:boolean){
        this.loggedIn = loggedIn
    }
    setLoading(loading:boolean){
        this.loading = loading
    }
    setLanguage(lan:string){
        this.language = lan;
    }
    setMessages(m:Message[]){
        this.messages = m
    }
    setUser(newuser:User){
          this.user = newuser
    }
    setAllUsers(users:User[]){
        this.users = users
    }
    setSessionKey(key:string){
        this.session_key = key;
    }
    // init - main function to set all parameters
    init =async()=>{
        await this.getUsers()
        await jobsStore.getAllPosts()
        await this.getUserMessages();
}
getUserNameById = (id:string):string=>{
        const user =   this.users.find(user=>user.id==id) ;
        return user? user.name :'';

}

getUserMessages = async ()=>{
    try {
        //sent
        const allSentMessages = await axios.post('http://localhost:3002/messages/byid',{receiverId:this.user.id});
        console.log(allSentMessages)
        if(allSentMessages.data.success) {
            this.setMessages(allSentMessages.data.messages)
        }
        else{
            return allSentMessages.data
        }
    } catch (error) {
        console.error('Error getting users', error);
    }
}
    getUserById =async (id:string)=>{
        try {
            const result = await axios.get('http://localhost:3002/users',{params:{id:id}});
            if(result.data.success) {
                return result.data
            }
            else{
                return result.data
            }
        } catch (error) {
            console.error('Error getting users', error);
        }
    }
    getUsers =async ()=>{
        try {
            const result = await axios.get('http://localhost:3002/users');
            if(result.data.success) {
                this.setAllUsers(result.data.users)
                return result.data
            }
            else{
                return result.data
            }
        } catch (error) {
            console.error('Error getting users:', error);
        }
}
    logout = async()=>{
        localStorage.removeItem('userInfo')
        this.setLoggedIn(false)
    }
    makeFollow= async (userId:string,userIdToFollow:string)=>{
        try {
            const result = await axios.post('http://localhost:3002/users/follow', {userId,userIdToFollow});
            if(result.data.success) {
               this.setUser(result.data.user.user)
                return result.data
            }
            else{
                return result.data
            }
        } catch (error) {
            console.error('Error making follow:', error);
        }
    }
    signup = async (name:string,password:string, email:string, role:string)=>{
        try {
            const result = await axios.post('http://localhost:3002/users/signup', {name, password, email, role});
            if(result.data.success) {
                this.setUser(result.data.user)
                this.setLoggedIn(true)
                this.setSignedUp(true)
              await  this.init();
                return result.data
            }
            else{
                return result.data
            }
        } catch (error) {
            console.error('Error signup:', error);
        }
    };
    post = async(title:string, employee_id:string, description:string, userName:string)=>{
        try {
            const result = await axios.post('http://localhost:3002/posts', {title:title,employee_id:employee_id, description:description, writer_name:userName});
            if(result.data.success) {
                return result.data
            }
            else{
                return result.data
            }
        } catch (error) {
            this.setLoading(false);
            console.error('Error post your post:', error);
        }
    }
    login = async (email:string, password:string) => {
        try {
            const result = await axios.post('http://localhost:3002/users/login', {email:email, password:password});
                if(result.data.success) {
                    this.setLoading(false);
                    this.setUser(result.data.user)
                    this.setLoggedIn(true)
                  await  this.init();
                    return result.data

                }
                else{
                    this.setLoading(false);
                    return result.data
                }
        } catch (error) {
            this.setLoading(false);
            console.error('Error login:', error);
        }
    };

}


const userStore = new UserStore();
export default userStore;

hydrate('userInfo', userStore); // 'userStore' is the key under which your store will be stored


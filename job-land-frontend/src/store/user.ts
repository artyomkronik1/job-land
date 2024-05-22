import {action, makeAutoObservable, makeObservable, observable} from "mobx";
import axios from 'axios';
import {User} from "../interfaces/user";
import {create, persist} from "mobx-persist";
import jobsStore from "./job";
import {Message} from "../interfaces/message";
import {Chat} from "../interfaces/chat";
import {Post} from "../interfaces/post";
import MessageService from "../services/messageService";
import AuthService from "../services/authService";
import UserService from "../services/userService";
const hydrate = create({
    jsonify:true
})
class UserStore{
    @persist tab = "Home";
    @persist  language ="en";
    @persist loading=false;
    @persist loggedIn= false;
    @persist signedUp=true;
    @persist('object') @observable users:User[]=[];
    @persist('object') @observable chats:Chat[]=[]
    @persist('object') @observable posts:Post[]=[]
    @persist('object') @observable currentChat:{}={};
    @persist('object') @observable user:User={id:"",password:"",role:"",email:"", about:"",name:"", follow:[]};
    @persist session_key=localStorage.getItem('session_key')
    constructor() {
        makeAutoObservable(this);
        // Hydrate the persisted data
        hydrate('userStore', this, {
            // Exclude sensitive data from being persisted
            exclude: ['loading', 'session_key', 'user', 'chats', 'posts', 'currentChat']
        }).then(() => {
            console.log('UserStore has been hydrated');
        });
    }
    getLoading(){
        return this.loading;
    }
    getTab(){
        return this.tab;
    }
    getChats(){
        return this.chats
    }
    getPost(){
        return this.chats
    }
    getCurrentChat(){
        return this.currentChat
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
    setCurrentChat(msg:Chat){
        this.currentChat = msg;
    }
    setTab(t:string){
        this.tab = t;
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
    setChats(m:Chat[]){
        this.chats = m
    }
    setUsersPosts(p:Post[]){
        this.posts = p;
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
        await this.getChatsByUser(this.user.id)
        await jobsStore.getAllPosts()
        await jobsStore.getALlJobs()
        //await this.getUserMessages();
}
     groupMessagesIntoChats = (messages: Message[]): any[] => {
        const chats: { [key: string]: Message[] } = {};

        messages.forEach((message) => {
            const chatKey = `${message.sender}-${message.receiver}`;
            if (!chats[chatKey]) {
                chats[chatKey] = [];
            }
            chats[chatKey].push(message);
        });

        return Object.values(chats).map((messages) => ({ messages }));
    };

   async getChatsByUser(id:string){

        const res= await MessageService.getChatsByUserId(id);
        if(res.success){
            this.setChats(res.chats)
        }
        else{
            this.setChats([])
        }

    }
getUserNameById = (id:string):string=>{
        const user =   this.users.find(user=>user.id==id) ;
        return user? user.name :'';

}
    // @ts-ignore
    getUserByName = (name:string):User =>{
            let userr:User ={    id: "",
                name: "",
                password: "",
                email: "",
                role: "",
                follow:[],
                about:""}
        this.users.forEach((user:User)=>{
            if(user.name == name)
            {
                userr = user
            }
        })
        return userr
    }
getUserInfoById = (id:string):any =>{
    return   this.users.find(user=>user.id==id) ;
}
    getMessagesByPersons = async (otherId:string)=>{
        try {
            let result: any;
            result = await axios({
                method: 'get',
                url: 'http://localhost:3002/messages',
                params: {receiverId: this.user.id, senderId: otherId},
            })
                .then(response => {
                    if (result.data.success) {
                        const res = this.groupMessagesIntoChats(result.data.messages)
                        this.setCurrentChat(res[0])
                    } else {
                        return result.data
                    }
                })
                .catch(error => {
                    // Handle errors
                    console.error('Error:', error);
                });


          //  const result = await axios.post('http://localhost:3002/messages',{receiverId:this.user.id , senderId:otherId});

        } catch (error) {
            console.error('Error getting messages', error);
        }
    }
    getPostsByUserName = async ()=>{
        try {
            //sent
            const allPostsByUser = await axios.post('http://localhost:3002/posts',{name:this.user.name});
            if(allPostsByUser.data.success) {
                this.setUsersPosts(allPostsByUser.data.posts)
            }
        } catch (error) {
            console.error('Error getting users messages', error);
        }
    }
    setUserInfo=async (user:User):Promise<any>=>{
        try {
            //sent
            return await axios.post('http://localhost:3002/users/user',{user:user});

        } catch (error) {
            console.error('Error getting users messages', error);
        }
    }

getUserMessages = async ()=>{
    try {
        //sent
        const allSentMessages = await axios.post('http://localhost:3002/messages/byid',{receiverId:this.user.id});
        if(allSentMessages.data.success) {
            this.setChats(this.groupMessagesIntoChats(allSentMessages.data.messages))
        }
        else{
            return allSentMessages.data
        }
    } catch (error) {
        console.error('Error getting users messages', error);
    }
}
    getUserById =async (id:string)=>{
        try {
            const result = await UserService.getUserById(id)
            if(result.success) {
                return result
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
            const result = await UserService.getUsers()
            if(result.success) {
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
        localStorage.removeItem('jobsStore')
        localStorage.removeItem('userStore')

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
            const result = await AuthService.signup( name, password, email, role);

            if(result.success) {
                this.setUser(result.user)
                this.setLoggedIn(true)
                this.setSignedUp(true)
              await  this.init();
                return result
            }
            else{
                return result
            }
        } catch (error) {
            console.error('Error signup:', error);
        }
    };
    post = async(title:string, employee_id:string, description:string, userName:string)=>{
        try {
            const result = await axios.post('http://localhost:3002/posts/new', {title:title,employee_id:employee_id, description:description, writer_name:userName});
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
            const result = await AuthService.login( email,password);
                if(result.success) {
                    this.setLoading(false);
                    this.setUser(result.user)
                    this.setLoggedIn(true)
                  await  this.init();
                    return result

                }
                else{
                    this.setLoading(false);
                    return result
                }
        } catch (error) {
            this.setLoading(false);
            console.error('Error login:', error);
        }
    };

}


const userStore = new UserStore();
export default userStore;


import {action, makeAutoObservable, makeObservable, observable} from "mobx";
import axios from 'axios';
import {User} from "../interfaces/user";
import {create, persist} from "mobx-persist";
import jobsStore from "./job";
import {Message} from "../interfaces/message";
import {Chat} from "../interfaces/chat";
import {Post} from "../interfaces/post";
const hydrate = create({
    storage:localStorage,
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
        await jobsStore.getAllPosts()
        await this.getUserMessages();
}
     groupMessagesIntoChats = (messages: Message[]): Chat[] => {
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
getUserInfoById = (id:string):User | undefined=>{
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
        console.log(allSentMessages)
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


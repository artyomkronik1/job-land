import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import axios from 'axios';
import { User } from "../interfaces/user";
import { create, persist } from "mobx-persist";
import jobsStore from "./job";
import { Message } from "../interfaces/message";
import { Chat } from "../interfaces/chat";
import { Post } from "../interfaces/post";
import MessageService from "../services/messageService";
import AuthService from "../services/authService";
import UserService from "../services/userService";
import CryptoJS from "crypto-js";
import { UsersNotification } from "../interfaces/usersNotification";
import NotificationService from "../services/notificationsService";
const hydrate = create({
    jsonify: true
})
const secretKey = 'job-land';

class UserStore {
    @persist tab = "Home";
    @persist language = "en";
    @persist loading = false;
    @persist loggedIn = false;
    @persist signedUp = true;
    @persist forgotPass = false;
    @persist searchValue = '';

    @persist('object') @observable newUserToChat: string = "";
    @persist('object') @observable users: User[] = [];
    @persist('object') @observable chats: Chat[] = []
    @persist('object') @observable notifications: UsersNotification[] = []

    @persist('object') @observable posts: Post[] = []
    @persist('object') @observable currentChat: Chat = { _id: '', messages: [] };
    @persist('object') @observable user: User = { profilePicture: "", backgroundPicture: "", id: "", password: "", role: "", email: "", about: "", name: "", follow: [], experience: "", education: "" };
    @persist session_key = localStorage.getItem('session_key')
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
    getLoading() {
        return this.loading;
    }
    getTab() {
        return this.tab;
    }
    getSearchValue() {
        return this.searchValue
    }
    getnewUserToChat() {
        return this.newUserToChat;
    }
    getNotifications() {
        return this.notifications;
    }
    getForgotPass() {
        return this.forgotPass;
    }
    getChats() {
        return this.chats
    }
    getPost() {
        return this.chats
    }
    getCurrentChat() {
        return this.currentChat
    }
    getUser() {
        return this.user
    }
    getLanguage() {
        return this.language
    }
    getSessionKey() {
        return this.session_key
    }
    getLoggedIn() {
        return this.loggedIn
    }
    getSignedUp() {
        return this.signedUp
    }
    setSignedUp(SignedUp: boolean) {
        this.signedUp = SignedUp
    }
    setCurrentChat(msg: Chat) {
        this.currentChat = msg;
    }
    setTab(t: string) {
        this.tab = t;
    }
    setLoggedIn(loggedIn: boolean) {
        this.loggedIn = loggedIn
    }
    setLoading(loading: boolean) {
        this.loading = loading
    }
    setSearchValue(v: string) {
        this.searchValue = v
    }
    setForgotPass(pass: boolean) {
        this.forgotPass = pass
    }
    setnewUserToChat(id: string) {
        this.newUserToChat = id
    }
    setLanguage(lan: string) {
        this.language = lan;
    }
    setChats(m: Chat[]) {
        this.chats = m
    }
    setUsersPosts(p: Post[]) {
        this.posts = p;
    }
    setUser(newuser: User) {
        this.user = newuser
    }
    setAllUsers(users: User[]) {
        this.users = users
    }
    setSessionKey(key: string) {
        this.session_key = key;
    }
    setNotifications(notification: UsersNotification[]) {
        this.notifications = notification
    }
    // init - main function to set all parameters
    init = async () => {
        await this.getUsers()
        await this.getChatsByUser(this.user.id)
        await jobsStore.getAllPosts()
        await jobsStore.getALlJobs()

        await this.getUsersNotifications(this.user.id);
        //await this.getUserMessages();
    }

    getUsersNotifications = async (id: string) => {
        const res = await NotificationService.getNotifications(id);
        if (res.success) {
            this.setNotifications(res.notifications)

        }
        else {
            this.setNotifications([])
        }

    }

    getSingleNot = async (from: string, to: string, type: string, link: string) => {
        const notifications: any = await NotificationService.getAllNotifications();
        if (notifications.success) {
            return notifications.notifications.find((not: UsersNotification) => not.from.toString() == from.toString() && not.link?.toString() == link.toString() && not.type?.toString() == type.toString() && not.to.toString() == to.toString())
        }
        else { return null }
    }
    makeNotifications = async (not: UsersNotification) => {
        return await NotificationService.addNotifications(not);

    }
    removeNotification = async (not: UsersNotification) => {
        return await NotificationService.removeNotifications(not)
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

    async uploadProfilePicture(downloadURL: string, user: User) {
        const updatedUser: User = { ...user, profilePicture: downloadURL };
        this.setUser(updatedUser)
        this.users.forEach((u: User) => {
            if (u.id == user.id) {
                u.profilePicture = downloadURL

            }
        })
        UserService.setUserInfo(updatedUser)
        //    await this.getUsers()



    }
    async uploadBackgroundPicture(downloadURL: string, user: User) {
        const updatedUser: User = { ...user, backgroundPicture: downloadURL };
        this.setUser(updatedUser)
        this.users.forEach((u: User) => {
            if (u.id == user.id) {
                u.backgroundPicture = downloadURL
            }
        })
        UserService.setUserInfo(updatedUser)
        //await this.getUsers()


    }



    async getChatsByUser(id: string) {

        const res = await MessageService.getChatsByUserId(id);
        if (res.success) {
            this.setChats(res.chats)


        }
        else {
            this.setChats([])
        }

    }
    getUserNameById = (id: string): string => {
        const user = this.users.find(user => user.id == id);
        return user ? user.name : '';

    }
    getUserByEmail = (email: string): any => {
        const user = this.users.find(user => user.email == email.toString());
        return user;

    }
    // @ts-ignore
    getUserByName = (name: string): User => {
        let userr: User = {
            id: "",
            name: "",
            password: "",
            email: "",
            role: "",
            follow: [],
            about: "",
            education: "",
            experience: "",
            profilePicture: "",
            backgroundPicture: ""
        }
        this.users.forEach((user: User) => {
            if (user.name == name) {
                userr = user
            }
        })
        return userr
    }
    getUserInfoById = (id: string): any => {
        return this.users.find(user => user.id == id);
    }

    getMessagesByPersons = async (otherId: string) => {
        try {
            let result: any;
            result = await axios({
                method: 'get',
                url: 'http://localhost:3002/messages',
                params: { receiverId: this.user.id, senderId: otherId },
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
    getPostsByUserName = async () => {
        try {
            //sent
            const allPostsByUser = await axios.post('http://localhost:3002/posts', { name: this.user.name });
            if (allPostsByUser.data.success) {
                this.setUsersPosts(allPostsByUser.data.posts)
            }
        } catch (error) {
            console.error('Error getting users messages', error);
        }
    }


    getUserMessages = async () => {
        try {
            //sent
            const allSentMessages = await axios.post('http://localhost:3002/messages/byid', { receiverId: this.user.id });
            if (allSentMessages.data.success) {
                this.setChats(this.groupMessagesIntoChats(allSentMessages.data.messages))
            }
            else {
                return allSentMessages.data
            }
        } catch (error) {
            console.error('Error getting users messages', error);
        }
    }
    getUserById = async (id: string) => {
        try {
            const result = await UserService.getUserById(id)
            if (result.success) {
                return result
            }
            else {
                return result.data
            }
        } catch (error) {
            console.error('Error getting users', error);
        }
    }
    getUsers = async () => {
        try {
            const result = await UserService.getUsers()
            if (result.data.success) {
                this.setAllUsers(result.data.users)
                return result.data
            }
            else {
                this.setAllUsers([])

                return result.data
            }
        } catch (error) {
            console.error('Error getting users:', error);
        }
    }
    logout = async () => {
        localStorage.removeItem('jobsStore')
        localStorage.removeItem('userStore')

        this.setLoggedIn(false)
    }
    makeFollow = async (userId: string, userIdToFollow: string) => {
        try {
            const result = await axios.post('http://localhost:3002/users/follow', { userId, userIdToFollow });
            if (result.data.success) {
                this.setUser(result.data.user.user)
                return result.data
            }
            else {
                return result.data
            }
        } catch (error) {
            console.error('Error making follow:', error);
        }
    }
    signup = async (name: string, password: string, email: string, role: string) => {
        try {
            await this.getUsers();

            if (this.users && this.users.length > 0) {
                const isUserExist = this.users.find((u: User) => u.email == email)
                if (isUserExist) {
                    return { success: false, errorCode: "Email is already in use" }
                }
                else {

                    // email check
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (email.length == 0) {
                        return { success: false, errorCode: "Email is empty" }

                    }
                    else if (!regex.test(email)) {
                        return { success: false, errorCode: "Email is invalid" }

                    }
                    else {
                        const result = await AuthService.signup(name, password, email, role);

                        if (result.success) {
                            this.setUser(result.user)
                            this.setLoggedIn(true)
                            this.setSignedUp(true)
                            await this.init();
                            return result
                        }
                        else {
                            return result
                        }
                    }
                }
            }
            else {

                // email check
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (email.length == 0) {
                    return { success: false, errorCode: "Email is empty" }

                }
                else if (!regex.test(email)) {
                    return { success: false, errorCode: "Email is invalid" }

                }
                else {
                    const result = await AuthService.signup(name, password, email, role);

                    if (result.success) {
                        this.setUser(result.user)
                        this.setLoggedIn(true)
                        this.setSignedUp(true)
                        await this.init();
                        return result
                    }
                    else {
                        return result
                    }
                }
            }
        } catch (error) {
            console.error('Error signup:', error);
        }

    };
    post = async (title: string, employee_id: string, description: string, userName: string, postPicture: string) => {
        try {
            const result = await axios.post('http://localhost:3002/posts/new', { title: title, employee_id: employee_id, description: description, writer_name: userName, postPicture: postPicture });
            if (result.data.success) {
                return result.data
            }
            else {
                return result.data
            }
        } catch (error) {
            this.setLoading(false);
            console.error('Error post your post:', error);
        }
    }
    loginWithGoogle = (email: string, username: string) => {
        this.getUsers()
        let user: any = {}
        this.users.forEach((u: User) => {
            if (u.email.toString() == email.toString() && u.name.toString() == username.toString()) {
                user = u
            }
        })
        return user

    }
    login = async (email: string, password: string) => {

        try {
            const result = await AuthService.login(email, password);
            if (result.success) {
                this.setLoading(false);
                this.setUser(result.user)
                this.setLoggedIn(true)
                await this.init();
                return result

            }
            else {
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


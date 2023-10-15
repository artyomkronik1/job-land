import {action, makeAutoObservable, makeObservable, observable} from "mobx";
import axios from 'axios';
import {User} from "../interfaces/user";
import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";
import React, {createContext, useContext} from "react";
import {create, persist} from "mobx-persist";
const hydrate = create({
    storage:localStorage,
    jsonify:true
})
class UserStore{
   language ="en";
   loggedIn= false;
 signedUp=true;
    @persist('object') @observable user:User={id:"",password:"",role:"",email:"",name:""};
 session_key=localStorage.getItem('session_key')
    constructor() {
        makeAutoObservable(this);

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
    setLanguage(lan:string){
        this.language = lan;
    }
    setUser(newuser:User){
       // console.log('got',newuser)
          this.user = newuser
        console.log('a', this.user)
    }
    signup = async (name:string,password:string, email:string, role:string)=>{
        try {
            const result = await axios.post('http://localhost:3002/users/signup', {name, password, email, role});
            if(result.data.success) {
                this.setUser(result.data.user)
                return result.data
            }
            else{
                return result.data
            }
        } catch (error) {
            console.error('Error signup:', error);
        }
    };
    login = async (email:string, password:string) => {
        try {
            const result = await axios.post('http://localhost:3002/users/login', {email:email, password:password});
                if(result.data.success) {
                    this.setUser(result.data.user)
                    return result.data
                }
                else{
                    return result.data
                }
        } catch (error) {
            console.error('Error login:', error);
        }
    };

}


const userStore = new UserStore();
export default userStore;

hydrate('userInfo', userStore); // 'userStore' is the key under which your store will be stored


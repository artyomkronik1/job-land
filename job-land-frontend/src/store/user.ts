import {action, makeAutoObservable, makeObservable, observable} from "mobx";
import axios from 'axios';
import {User} from "../interfaces/user";
class UserStore{
     language ="en";
      loggedIn= false;
      signedUp=true;
    constructor() {
        makeObservable(this, {
            language: observable,
            loggedIn: observable,
            login: action,
        });
    }
    getLanguage(){
        return this.language
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
    //hash password
      hashPassword = (password:string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        return window.crypto.subtle.digest('SHA-256', data).then(arrayBuffer => {
            const hashArray = Array.from(new Uint8Array(arrayBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        });
    };
    signup = async (name:string,password:string, email:string, role:string)=>{
        try {
            const hashedPassword = await this.hashPassword(password);
            const result = await axios.post('http://localhost:3002/users/login', {email:email, password:hashedPassword});
            if(result.data.success) {
                this.setLoggedIn(true)
                this.setSignedUp(true)
            }
            else{
                this.setLoggedIn(false)
            }
        } catch (error) {
            console.error('Error login:', error);
        }
    };
    login = async (email:string, password:string) => {
        try {
            const hashedPassword = await this.hashPassword(password);
            const result = await axios.post('http://localhost:3002/users/login', {email:email, password:hashedPassword});
                if(result.data.success) {
                    this.setLoggedIn(true)
                    this.setSignedUp(true)
                }
                else{
                    this.setLoggedIn(false)
                }
        } catch (error) {
            console.error('Error login:', error);
        }
    };

}
export default new UserStore()
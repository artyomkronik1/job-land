import {action, makeAutoObservable, makeObservable, observable} from "mobx";
import axios from 'axios';
import {User} from "../interfaces/user";
class UserStore{
     language ="en";
      loggedIn= false;
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
    getLoggeIn(){
        return this.loggedIn
    }
    setLoggedIn(loggedIn:boolean){
        this.loggedIn = loggedIn
    }
    setLanguage(lan:string){
        this.language = lan;
    }
    login = async (email:string, password:string) => {
        try {
            const result = await axios.post('http://localhost:3002/users/login', {email:email, password:password});
            if(result) {
               this.loggedIn = true;
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

}
export default new UserStore()
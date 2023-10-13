import {action, makeAutoObservable, makeObservable, observable} from "mobx";

class UserStore{
     language ="en";
      loggedIn= false;
    constructor() {
        makeObservable(this, {
            language: observable,
            loggedIn: observable,
            fetchData: action,
        });
    }
    getLanguage(){
        return this.language
    }
    getLoggeIn(){
        return this.loggedIn
    }
    setLoggedIn(loggedIn){
        this.loggedIn = loggedIn
    }
    setLanguage(lan){
        this.language = lan;
    }
    fetchData = async () => {
        try {
            const response = await fetch('https://api.example.com/data');
            const result = await response.json();
            this.data = result; // Update the observable data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
}
export default new UserStore()
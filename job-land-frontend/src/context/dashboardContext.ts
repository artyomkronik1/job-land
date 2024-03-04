import {createContext} from "react";
import {User} from "../interfaces/user";
import {useContext} from "react";

// @ts-ignore
export const DashboardContext = createContext<User>({
    id: "",
    name: "",
    password: "",
    email: "",
    role: "",
    follow:[],
    about:""
});

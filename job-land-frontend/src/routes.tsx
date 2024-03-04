import type { } from 'react-router';
import {Route} from "react-router";
import Login from "./components/login/login";
import ProfileComponent from "./components/profile-component/profile-component";
const routes: any[] = [
    {
                path: '/login',
                element: (
                        <Login />
                )
            },


]
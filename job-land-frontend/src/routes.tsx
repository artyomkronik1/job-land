import type { } from 'react-router';
import {Route} from "react-router";
import Login from "./components/login/login";
const routes: any[] = [
    {
                path: '/login',
                element: (
                        <Login />
                )
            },

]
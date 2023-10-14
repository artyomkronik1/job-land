import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {toast} from "react-toastify";

const  SignIn  = observer( ()=>{
    const { t } = useTranslation();

    return (
        <div></div>
    );
} )
export default SignIn
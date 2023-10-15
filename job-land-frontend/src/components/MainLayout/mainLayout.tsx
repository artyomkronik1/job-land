import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useState} from "react";
import {toast} from "react-toastify";
import Login from "../login/login";
import SignIn from "../signIn/signIn";
const  MainLayout  = observer( ()=>{

    const { t } = useTranslation();
    console.log(UserStore.getUser())
    return (
      <div>
          {UserStore.getSessionKey()? (
              <div>
                  main
              </div>
          ) :
            <Login/>
          }
      </div>
    );
} )
export default MainLayout
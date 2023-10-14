import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {toast} from "react-toastify";
import Login from "../login/login";
import SignIn from "../signIn/signIn";

const  MainLayout  = observer( ()=>{
    const { t } = useTranslation();

    return (
      <div>
          {!UserStore.getLoggedIn() && UserStore.getSignedUp()? (
              <Login/>
          ) : !UserStore.getLoggedIn() && !UserStore.getSignedUp()? (
              <SignIn/>
          ):UserStore.getLoggedIn() && UserStore.getSignedUp()? (
              <div> main </div>
          ) : null}
      </div>
    );
} )
export default MainLayout
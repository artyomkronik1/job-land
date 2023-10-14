import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from "./components/login/login";
import UserStore from './store/user'
import SignIn from "./components/signIn/signIn";
import MainLayout from "./components/MainLayout/mainLayout";
function App() {
  return (
    <div className="App">
        {!UserStore.getLoggedIn() && UserStore.getSignedUp()? (
            <Login/>
        ) : !UserStore.getLoggedIn() && !UserStore.getSignedUp()? (
            <SignIn/>
        ):UserStore.getLoggedIn() && UserStore.getSignedUp()? (
            <MainLayout/>
        ) : null}

    </div>
  );
}

export default App;

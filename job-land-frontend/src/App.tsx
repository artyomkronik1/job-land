import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import Login from "./components/login/login";
import './locales/i18n'; // Initialize i18n
import SignIn from "./components/signIn/signIn";
import {BrowserRouter as Router, Route, Routes,} from 'react-router-dom';
import MainLayout from "./components/MainLayout/mainLayout";
import UserStore from "./store/user";
import {useTranslation} from "react-i18next";
import Spinner from "./base-components/loading-spinner/loading-spinner";
import NetworkComponent from "./components/network/network-component";
import BasicComponent from "./components/basic-component/basic-component";
import JobsComponent from "./components/jobs-component/jobs-component";
function App() {
    const { i18n } = useTranslation();
    useEffect(() => {
        i18n.changeLanguage(UserStore.getLanguage());
    }, []);
  return (
      <Router>
        <div className="App">
            <BasicComponent>
                <Routes>
                    <Route path="/signup" element={<SignIn/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/home" element={<MainLayout />} />
                    <Route path="/" element={<MainLayout />} />
                    <Route path="/network" element={<NetworkComponent/>}/>
                    <Route path="/jobs" element={<JobsComponent/>}/>
                </Routes>
            </BasicComponent>

        </div>
      </Router>
  );
}

export default App;

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
function App() {
    const { i18n } = useTranslation();
    useEffect(() => {
        i18n.changeLanguage(UserStore.getLanguage());
    }, []);
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignIn/>}/>
          </Routes>
        </div>
      </Router>
  );
}

export default App;

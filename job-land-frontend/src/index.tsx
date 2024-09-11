import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import './locales/i18n'; // Initialize i18n
import reportWebVitals from './reportWebVitals';
import UserStore from './store/user'
import { I18nextProvider } from 'react-i18next';
import firebase from 'firebase/compat/app'
import i18n from './locales/i18n'
// firebase config and initialize 
const firebaseConfig = {
  apiKey: "AIzaSyCdPRSZCNMWpboV-eZNzQVaLE0TeIYSd6Q",
  authDomain: "job-land-fbf1b.firebaseapp.com",
  projectId: "job-land-fbf1b",
  storageBucket: "job-land-fbf1b.appspot.com",
  messagingSenderId: "244318148604",
  appId: "1:244318148604:web:df3340efb08628b8404479",
  measurementId: "G-RNXP3F3FXV"
};
firebase.initializeApp(firebaseConfig)
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


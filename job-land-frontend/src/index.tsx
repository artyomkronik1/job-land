import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import './locales/i18n'; // Initialize i18n
import reportWebVitals from './reportWebVitals';
import { Global } from '@emotion/react';
import globals from './assets/global-styles/globals';
import UserStore from './store/user'
import { I18nextProvider } from 'react-i18next';
import {Context} from './context'
import i18n from './locales/i18n'
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

      <React.StrictMode>
          <I18nextProvider i18n={i18n}>
          <Global styles={globals} />
          <Context.Provider value={UserStore}>
           <App />
          </Context.Provider>
          </I18nextProvider>
      </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { useState } from 'react';
import TextInputField from "../../base-components/text-input/text-input-field";
import styles from './login.module.scss'
import globalStyles from '../../assets/global-styles/styles.module.scss'
import { useTranslation } from 'react-i18next';
import icon from "../../assets/images/icon.jpg"
function Login() {
    const { t } = useTranslation();
    //password
    const [userPassword, setUserPassword] = useState('');
    const handleInputChangePassword = (value:string) => {
        setUserPassword(value);
    };

    //email
    const [userEmail, setUserEmail] = useState('');
    const handleInputChangeEmail = (value:string) => {
        setUserEmail(value);
    };


    return (
   <form className={styles.form}>
       {/*header*/}
       <div className={styles.formHeader}>
           <div className={styles.formHeaderDiv}>
            <div className={styles.logoDiv}>
            <img src={icon} width="100%" height="100%"/>
            </div>
           <h1 className={styles.title} > {t('Welcome to your professional space')}</h1>
           </div>
       </div>
       <div className={styles.body}>
           <div className={styles.textForm}>
             <TextInputField type={'text'} placeHolder={t('Enter Your Email')} text={t('Email')} value={userEmail} onChange={handleInputChangeEmail}/>
             <TextInputField type={'text'} placeHolder={t('Enter Your Password')} text={t('Password')} value={userPassword} onChange={handleInputChangePassword}/>
                <span className={globalStyles.mainSpan}>{t('Forgot your password?')}</span>
           </div>
           <div className={styles.logoPicture}></div>
       </div>
       </form>
    );
}

export default Login;
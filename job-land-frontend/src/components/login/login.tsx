import React, { useEffect, useState } from 'react';
import TextInputField from "../../base-components/text-input/text-input-field";
import styles from './login.module.scss'
import globalStyles from '../../assets/global-styles/styles.module.scss'
import { useTranslation } from 'react-i18next';
import icon from "../../assets/images/icon.jpg"
import en from '../../assets/images/languages/en.png'
import he from '../../assets/images/languages/he.png'
import googleIcon from '../../assets/images/social-media/google.png'
import facebookIcon from '../../assets/images/social-media/facebook.png'
import UserStore from '../../store/user';
import { observer } from "mobx-react-lite";
import ToastComponent from '../../base-components/toaster/ToastComponent';
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import CryptoJS from "crypto-js";
import loginPicture from '../../assets/images/login.png'

import 'firebase/compat/auth'; // Import the auth module explicitly
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Import the auth module explicitly

import { User } from '../../interfaces/user';
import AuthService from '../../services/authService';
const Login = observer(() => {

    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    const navigate = useNavigate();
    //password
    const [userPassword, setUserPassword] = useState('');
    const handleInputChangePassword = (value: string) => {
        setUserPassword(value);
    };

    //email
    const [userEmail, setUserEmail] = useState('');
    const handleInputChangeEmail = (value: string) => {
        setUserEmail(value);
    };
    const secretKey = 'job-land'; //  secret key
    const resetParameter = () => {
        setUserEmail('')
        setUserPassword('')
    }

    //login
    const login = async (event: any) => {
        event.preventDefault();
        if (userEmail.length == 0 || userPassword.length == 0) {
            toast.error('ERROR! One or more fields is empty');
        }
        const encryptedPassword = CryptoJS.AES.encrypt(userPassword, secretKey).toString();
        const res = await UserStore.login(userEmail, encryptedPassword)
        if (res?.success) {
            resetParameter()
            UserStore.setLoading(true);
            toast.success(t('SUCCESS'));
            setTimeout(() => {
                UserStore.setLoading(false);
                UserStore.setSessionKey(res.session_key)
                navigate('/')
            }, 3000);
        } else {
            toast.error(t('ERROR') + ' ' + res?.errorCode);
        }
    }

    const goSignUp = () => {
        navigate('/signup')
        UserStore.setSignedUp(false)
        UserStore.setLoggedIn(false)
    }
    const signInWithGoogle = async (event: any) => {

        event.preventDefault()

        const provider = new firebase.auth.GoogleAuthProvider();

        try {
            const result = await firebase.auth().signInWithPopup(provider);
            if (result && result.user && result.user.email && result.user.displayName) {
                const user: User = UserStore.loginWithGoogle(result.user.email.toString(), result.user.displayName.toString())
                // check if user exist with this email either sign in as a new
                if (user && user.email && user.password) {
                    const encryptedPassword = CryptoJS.AES.encrypt(user.password, secretKey).toString();
                    const res = await UserStore.login(user.email, encryptedPassword)
                    if (res?.success) {
                        resetParameter()
                        UserStore.setLoading(true);
                        toast.success(t('SUCCESS'));
                        setTimeout(() => {
                            UserStore.setLoading(false);
                            UserStore.setSessionKey(res.session_key)
                            navigate('/')
                        }, 3000);
                    } else {
                        toast.error(t('ERROR') + ' ' + res?.errorCode);
                    }
                }
                // make sign up with this email
                else {
                    const res = await UserStore.signup(result.user.displayName, 'emailsPassword', result.user.email, '0')
                    if (res?.success) {
                        UserStore.setLoading(true);
                        toast.success(t('SUCCESS'));
                        setTimeout(() => {
                            UserStore.setLoading(false);
                            UserStore.setSessionKey(res.session_key)
                            navigate('/')
                        }, 3000);
                    } else {
                        toast.error(t('ERROR!') + ' ' + res?.errorCode);
                    }
                }
            } else {
                toast.error(t('ERROR User is not exist'));
            }


            // Handle additional logic here, such as saving the user to your database or redirecting
        } catch (error) {
            console.error(error);
            toast.error('Failed to sign in with Google');
        }
    };
    const goToForgotPass = () => {
        UserStore.setForgotPass(true)

        navigate('/forgotPass')
    }
    return (

        <>
            <ToastComponent />
            <form className={styles.form} dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
                {/*toast*/}
                <ToastComponent />
                {/*header*/}
                <div className={styles.formHeader}>
                    <img src={icon} className={globalStyles.logoPic} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 className={styles.title} > {t('Welcome to your professional space')} <br />{t('to find a new job')} </h2>
                    </div>
                    <div className={styles.languageDiv}>
                        {UserStore.getLanguage() == 'en' ?
                            <img src={he} className={styles.heLanguagePic} onClick={() => changeLanguage('he')} />
                            :
                            <img src={en} className={styles.enlanguagePic} onClick={() => changeLanguage('en')} />
                        }
                    </div>
                </div>
                {/*body*/}
                <div className={styles.body}>
                    <div className={styles.textForm}>
                        <div style={{
                            display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px'
                        }}>
                            <TextInputField type={'text'} placeHolder={t('Enter Your Email')} text={t('Email')} value={userEmail} onChange={handleInputChangeEmail} />
                            <TextInputField type={'text'} placeHolder={t('Enter Your Password')} text={t('Password')} value={userPassword} onChange={handleInputChangePassword} />
                        </div>
                        <a className={globalStyles.mainSpan} onClick={() => goToForgotPass()} style={{ cursor: 'pointer' }}>{t('Forgot your password?')}</a>
                        <div style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}>
                            <button className={globalStyles.btn} onClick={login}> {t('Sign In')}</button>
                        </div>
                        <div style={{ marginTop: "40px" }} className={globalStyles.separate_line}></div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px' }} onClick={(event) => signInWithGoogle(event)} >
                            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '300px' }} className={globalStyles.btn_border} >
                                <img className={styles.socialMedia} src={googleIcon} />
                                <p className={globalStyles.simpleP}> {t('Continue with Google')} </p>
                            </button>
                        </div>




                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px' }}>
                            <button style={{ width: '300px' }} className={globalStyles.btn_border} onClick={() => goSignUp()}> {t('New in Jobland? join now!')}</button>
                        </div>
                    </div>
                    <img src={loginPicture} />
                </div>
            </form >
        </>
    );
})



export default Login;
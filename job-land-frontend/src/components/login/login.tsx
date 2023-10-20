import React, {useEffect, useState} from 'react';
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
import {observer} from "mobx-react-lite";
import ToastComponent from '../../base-components/toaster/ToastComponent';
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import CryptoJS from "crypto-js";
import loginPicture from '../../assets/images/login.png'
import Spinner from "../../base-components/loading-spinner/loading-spinner";
const  Login  = observer( ()=>{
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    const navigate = useNavigate();
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
    const secretKey = 'job-land'; //  secret key
    const resetParameter=()=>{
        setUserEmail('')
        setUserPassword('')
    }

    //login
    const login=async (event: any) => {
        event.preventDefault();
        if( userEmail.length==0 || userPassword.length==0)
        {
            toast.error('ERROR! One or more fields is empty' );
        }
        const encryptedPassword = CryptoJS.AES.encrypt(userPassword, secretKey).toString();
        const res = await UserStore.login(userEmail, encryptedPassword)
        if (res?.success) {
            resetParameter()
            UserStore.setLoading(true);
            toast.success('SUCCESS');
             setTimeout(() => {
                UserStore.setLoading(false);
                 UserStore.setSessionKey(res.session_key)
                 navigate('/')
             }, 3000);


        } else {
            toast.error('ERROR' + ' ' + res?.errorCode);
        }
    }

    return (

        <>
            <ToastComponent />
            {!UserStore.loading? (
        <form className={styles.form} dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
            {/*toast*/}
            <ToastComponent />
            {/*header*/}
            <div className={styles.formHeader}>
                <img src={icon}  className={globalStyles.logoPic}/>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <h2 className={styles.title} > {t('Welcome to your professional space' )} <br/>{t('to find a new job' )} </h2>
                </div>
                <div className={styles.languageDiv}>
                    { UserStore.getLanguage()=='en' ?
                        <img src={he} className={styles.heLanguagePic} onClick={()=>changeLanguage('he')}/>
                        :
                        <img src={en} className={styles.enlanguagePic}  onClick={()=>changeLanguage('en')}/>
                    }
                </div>
            </div>
            {/*body*/}
            <div className={styles.body}>
                <div className={styles.textForm}>
                    <TextInputField type={'text'} placeHolder={t('Enter Your Email')} text={t('Email')} value={userEmail} onChange={handleInputChangeEmail}/>
                    <TextInputField type={'text'} placeHolder={t('Enter Your Password')} text={t('Password')} value={userPassword} onChange={handleInputChangePassword}/>
                    <a className={globalStyles.mainSpan}>{t('Forgot your password?')}</a>
                    <div style={{marginTop:"15px", display:"flex", justifyContent:"center"}}>
                        <button className={globalStyles.btn} onClick={login}> {t('Sign In') }</button>
                    </div>
                    <div style={{marginTop:"40px"}} className={globalStyles.separate_line}></div>
                    <div style={{display:'flex', justifyContent:'space-around', marginTop:'30px', alignItems:'center'}}>
                        <img className={styles.socialMedia} src={googleIcon} />
                        <p className={globalStyles.simpleP}>{t('OR')}</p>
                        <img className={styles.socialMedia} src={facebookIcon} />
                    </div>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'30px'}}>
                        <button style={{width:'300px'}} className={globalStyles.btn_border} onClick={()=> navigate('/signup')}> {t('New in Jobland? join now!') }</button>
                    </div>
                </div>
               <img src={loginPicture}/>
            </div>
        </form>
            ):(<Spinner/>)}
</>
    );
} )



export default Login;
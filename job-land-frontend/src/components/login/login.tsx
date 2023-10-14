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
const  Login  = observer( ()=>{
    const navigate = useNavigate();
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
    //login
    const login=(event:any)=>{
        event.preventDefault();
        UserStore.login(userEmail, userPassword)
        if(UserStore.getLoggedIn())
        {
            toast.success('Success message!');
        }
        else{
            toast.error('error message!');
        }
    }

    return (
        <form className={styles.form} dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
            <ToastComponent />
            {/*header*/}
            <div className={styles.formHeader}>
                <img src={icon}  className={globalStyles.logoPic}/>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <h2 className={styles.title} > {t('Welcome to your professional space' )} <br/>{t('to find a new job' )} </h2>
                </div>
                <div className={styles.languageDiv}>
                    { UserStore.getLanguage()=='en' ?
                        <img src={he} className={styles.heLanguagePic} onClick={()=>UserStore.setLanguage('he')}/>
                        :
                        <img src={en} className={styles.enlanguagePic}  onClick={()=>UserStore.setLanguage('en')}/>
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
                <div className={styles.logoPicture}></div>
            </div>
        </form>
    );
} )



export default Login;
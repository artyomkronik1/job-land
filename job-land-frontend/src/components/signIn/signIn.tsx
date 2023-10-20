import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {toast} from "react-toastify";
import styles from "../login/login.module.scss";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import icon from "../../assets/images/icon.jpg";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import he from "../../assets/images/languages/he.png";
import en from "../../assets/images/languages/en.png";
import signupStyle from './signIn.module.scss'
import TextInputField from "../../base-components/text-input/text-input-field";
import googleIcon from "../../assets/images/social-media/google.png";
import facebookIcon from "../../assets/images/social-media/facebook.png";
import {useNavigate} from "react-router";
import CryptoJS from 'crypto-js';
import {Spinner} from "react-bootstrap";

const  SignIn  = observer( ()=>{
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    const navigate = useNavigate();
    const [activeRole, setactiveRole] = useState(false);
    //full name
    const [userName, setuserName] = useState('');
    const handleInputChangeuserName = (value:string) => {
        setuserName(value);
    };
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
    //role
    const [role, setRole] = useState(0);
    const handleInputChangeuserRole = (event:any,value:number) => {
        event.preventDefault();
        setRole(value);
    };
    const secretKey = 'job-land'; //  secret key
    const resetParameter=()=>{
        setuserName('');
        setRole(0);
        setUserEmail('')
        setUserPassword('')
    }
    const signup=async (event: any) => {
        event.preventDefault()
        if(userName.length==0 || userEmail.length==0 || userPassword.length==0)
        {
            toast.error('ERROR! One or more fields is empty' );
        }
        else {
            const encryptedPassword = CryptoJS.AES.encrypt(userPassword, secretKey).toString();
            const res = await UserStore.signup(userName, encryptedPassword, userEmail, role.toString())
            if (res?.success) {
                UserStore.setLoading(true);
                toast.success('SUCCESS');
                setTimeout(() => {
                    UserStore.setLoading(false);
                    UserStore.setSessionKey(res.session_key)
                    navigate('/')
                }, 3000);
            } else {
                toast.error('ERROR!' + ' ' + res?.errorCode);
            }

        }
    }
    return (
        <>
            <ToastComponent />
            {!UserStore.loading? (
        <form className={styles.form} dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
            <ToastComponent />
            {/*header*/}
            <div className={styles.formHeader}>
                <img src={icon}  className={globalStyles.logoPic}/>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <h2 className={styles.title} > {t('Join Jobland to find the right job' )} </h2>
                </div>
                <div className={styles.languageDiv}>
                    { UserStore.getLanguage()=='en' ?
                        <img src={he} className={styles.heLanguagePic} onClick={()=>changeLanguage('he')}/>
                        :
                        <img src={en} className={styles.enlanguagePic} onClick={()=>changeLanguage('en')}/>
                    }
                </div>
            </div>
            {/*body*/}
            <div className={styles.body}>
                <div className={styles.textForm}>
                    <TextInputField type={'text'} placeHolder={t('Enter Your Full Name')} text={t('Full Name')} value={userName} onChange={handleInputChangeuserName}/>
                    <TextInputField type={'text'} placeHolder={t('Enter Your Email')} text={t('Email')} value={userEmail} onChange={handleInputChangeEmail}/>
                    <TextInputField type={'text'} placeHolder={t('Enter Your Password')} text={t('Password')} value={userPassword} onChange={handleInputChangePassword}/>
                    <div style={{display:'flex', justifyContent:'space-around', alignItems:'center', gap:'20px'}}>
                       <button style={{width:'150px'}} onClick={(e)=>handleInputChangeuserRole(e,0)} className={role==0?  globalStyles.btn : globalStyles.btn_border}>{t('Search job')}</button>
                        <button style={{width:'150px'}} onClick={(e)=>handleInputChangeuserRole(e,1)} className={role==1?  globalStyles.btn : globalStyles.btn_border}>{t('Post job')}</button>
                    </div>
                    <div style={{marginTop:"35px", display:"flex", justifyContent:"center"}}>
                        <button className={globalStyles.btn}  onClick={signup}> {t('Sign Up') }</button>
                    </div>
                    <div style={{marginTop:"40px"}} className={globalStyles.separate_line}></div>

                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'30px'}}>
                        <button style={{width:'300px'}} className={globalStyles.btn_border} onClick={()=> navigate('/login')}> {t('Already on Jobland? Sign in') }</button>
                    </div>
                </div>
                <div className={signupStyle.logoPicture}></div>
            </div>
        </form>
            ):(<Spinner/>)}
            </>
    );
} )
export default SignIn
import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {ReactNode, useContext, useEffect, useState} from "react";
import Login from "../login/login";
import componentStyles from './network.module.scss'
import logo from'../../assets/images/icon.jpg'
import styles from "../../assets/global-styles/styles.module.scss";
import SearchInput from "../../base-components/search-input/search-input";
import he from "../../assets/images/languages/he.png";
import en from "../../assets/images/languages/en.png";
import SideBtnComponent from "../../base-components/side-btn/side-btn-component";
import JobFilterBtn from "../../base-components/job-filter-btn/job-filter-btn";
import DropDown from "../../base-components/dropdown-component/dropdown";
import {useNavigate} from "react-router";
import Spinner from "../../base-components/loading-spinner/loading-spinner";
import SignIn from "../signIn/signIn";
import ProfileComponent from "../profile-component/profile-component";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
export interface basicComponentProps{
    children: ReactNode;
}
const  BasicComponent  = observer( (props:basicComponentProps)=>{

    const navigate = useNavigate();
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    // profileSettings
    const [profileSettings, setprofileSettings] = useState('');
    const getSettingAction=(val:string)=>{
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            setprofileSettings(val)
            if(val=='Logout'){
                UserStore.logout();
                navigate('/login')
            }
            else if(val=='Profile')
            {
                navigate('/profile')
                settitle('Profile')
            }
        },1000)

    }
    // message box
    const [messageBoxIsOpen, setmessageBoxIsOpen] = useState(false);
    // search
    const [useSearchValue, setSearchValue] = useState('');
    //title
    const [title, settitle] = useState('Home');


    // sidebar options
    const userMainOptions=[
        {type:'fa fa-home', name:'Home'} ,
        {type:'fa fa-message', name:'Messages'} ,
        {type:'fa fa-briefcase', name:'Jobs'} ,
        {type:'fa fa-users', name:'Network'} ,
        {type:'fa fa-plus-circle', name:'New Post'} ,
        {type:'fa fa-bell', name:'Notifications'} ]
    const sideBarMainOptionsHtml = userMainOptions.map((value, index) => (
        <div key={index} style={{display:'flex', justifyContent:'start',flexDirection:'column', gap:'5px'}}>
            <SideBtnComponent iconType={value.type} btnName={t(value.name)} onClick={()=>moveOnSidebar('top',index)}/>
            <br/>
        </div>
    ));
    const bottomMainOptions=[
        {type:'fa fa-user-circle', name:'Profile'} ,
        {type:'fa fa-cog', name:'Settings'} ,
        {type:'fa fa-question-circle', name:t('Help & Support')} ] ;
    const bottomMainOptionsHtml = bottomMainOptions.map((value, index) => (
        <div key={index} style={{display:'flex', justifyContent:'start', flexDirection:'column', gap:'5px'}}>
            <SideBtnComponent iconType={value.type} btnName={t(value.name)}  onClick={()=>moveOnSidebar('down',index)}/>
            <br/>
        </div>
    ));
    const moveOnSidebar=(str:string,index:number)=>{
        if(str=='top')
        {
                navigate(`/${userMainOptions[index].name.toLowerCase()}`)
                settitle(userMainOptions[index].name)
        }
        if(str=='down') {
            settitle(bottomMainOptions[index].name)
            navigate(`/${bottomMainOptions[index].name.toLowerCase()}`);
        }
    }
    return (
        <>
            {!UserStore.loading?(
                <>
            {UserStore.loggedIn && UserStore.signedUp? (
                <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                    {UserStore.getSessionKey()? (
                            <div className={styles.main}>
                                <div className={styles.left}>
                                    <img src={logo} onClick={()=> moveOnSidebar('top',0)} className={styles.logoStyle} style={{display:'flex', justifyContent:'start'}}/>
                                    <div style={{display:'flex', flexDirection:'column', justifyContent:'start'}} >
                                        {sideBarMainOptionsHtml}
                                    </div>
                                    <div style={{display:'flex', flexDirection:'column', justifyContent:'start', bottom:'0px', position:'relative'}} >
                                        {bottomMainOptionsHtml}
                                    </div>
                                </div>

                                <div className={styles.right}>
                                    <div className={styles.right_header}>
                                        {/*left side*/}
                                        <div style={{display:'flex', alignItems:'center', gap:'40px', justifyContent:'start'}}>
                                            <h1 className={styles.h2}> {title}</h1>
                                            <SearchInput placeHolder={'search...'}  value={useSearchValue} ariaLabel={'Search..'} onChange={(vaalue)=>setSearchValue(vaalue)}/>
                                        </div>
                                        {/*user side*/}
                                        <div style={{display:'flex',gap:'50px', alignItems:'center'}}>
                                            <div style={{display:'flex',alignItems:'center', gap:'10px'}}>
                                                <DropDown options={['Profile', 'Logout']} changeDropValue={getSettingAction} icons={['fa fa-user-circle', 'fa fa-sign-out']}>
                                                    <ProfileImage name={UserStore.user.name}/>
                                                </DropDown>
                                                <div className={styles.languageDivBasic}>
                                                    { UserStore.getLanguage()=='en' ?
                                                        <img src={he} className={styles.heLanguagePic} onClick={()=>changeLanguage('he')}/>
                                                        :
                                                        <img src={en} className={styles.enlanguagePic}  onClick={()=>changeLanguage('en')}/>
                                                    }
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.right_main}>
                                        <div className={styles.right_main_main}>
                                            {props.children}
                                        </div>
                                        {/*messages*/}
                                        <div className={styles.right_main_messages }>
                                            {/*    open all message box*/}

                                            <div  className={`${styles.fade_in} ${messageBoxIsOpen ? `${styles.allMessagesContainer_visible}` :`${styles.allMessagesContainer_hidden}`}`}>
                                                {/*all user chats*/}
                                                <div className={styles.allMessagesContainer}  >
                                                    <div  >
                                                        <div className={styles.messageContainer}>
                                                            <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                                            <div style={{   display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                                                <span className={styles.simpleP}> {UserStore.getUser().name}</span>
                                                                <span style={{fontSize:'16px', fontWeight:'normal'}} className={styles.simpleP}> {UserStore.getUser().role}</span>
                                                            </div>
                                                            {UserStore.getLanguage()=='en'?( <i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-right" ></i>)
                                                                :(<i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-left"></i>)
                                                            }
                                                        </div>
                                                        <div style={{marginTop:'5px', marginBottom:'15px', marginInlineStart:'15px' ,display:'flex', width:'88%',  borderBottom:'0.5px solid #e8e8e8'}}> </div>

                                                        <div className={styles.messageContainer}>
                                                            <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                                            <div style={{display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                                                <span className={styles.simpleP}> {UserStore.getUser().name}</span>
                                                                <span style={{fontSize:'16px', fontWeight:'normal'}} className={styles.simpleP}> {UserStore.getUser().role}</span>
                                                            </div>
                                                            {UserStore.getLanguage()=='en'?( <i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-right" ></i>)
                                                                :(<i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-left"></i>)
                                                            }
                                                        </div>
                                                        <div style={{marginTop:'5px', marginBottom:'15px', marginInlineStart:'15px' ,display:'flex', width:'88%',  borderBottom:'0.5px solid #e8e8e8'}}> </div>

                                                        <div className={styles.messageContainer}>
                                                            <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                                            <div style={{display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                                                <span className={styles.simpleP}> {UserStore.getUser().name}</span>
                                                                <span style={{fontSize:'16px', fontWeight:'normal'}} className={styles.simpleP}> {UserStore.getUser().role}</span>
                                                            </div>
                                                            {UserStore.getLanguage()=='en'?( <i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-right" ></i>)
                                                                :(<i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-left"></i>)
                                                            }

                                                        </div>
                                                        <div style={{marginTop:'5px', marginBottom:'15px', marginInlineStart:'15px' ,display:'flex', width:'88%',  borderBottom:'0.5px solid #e8e8e8'}}> </div>

                                                    </div>

                                                </div>
                                            </div>
                                            <div  style={{position:'relative', bottom:'20px', width:'300px', backgroundColor:'white'}} onClick={()=> setmessageBoxIsOpen(!messageBoxIsOpen)}>
                                                <div className={styles.messageContainerMain}>
                                                    <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                                    <div style={{display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                                        <span className={styles.simpleP}> {UserStore.getUser().name}</span>
                                                        <span style={{fontSize:'16px', fontWeight:'normal'}} className={styles.simpleP}> {'1'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) :
                        <Login/>
                    }
                </div>
            ):UserStore.loggedIn===false && UserStore.signedUp? (<Login/>)
            :(<SignIn/>)}
                </>
            ):(<Spinner/>)}
        </>

    );
} )
export default BasicComponent
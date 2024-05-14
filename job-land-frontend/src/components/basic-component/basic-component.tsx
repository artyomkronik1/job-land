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
import StartPost from "../../dialogs/start-post/start-post";
import {Chat} from "../../interfaces/chat";
import x from '../../../src/assets/images/x.png';
import userStore from "../../store/user";
import {Message} from "../../interfaces/message";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import TextAreaComponent from "../../base-components/textArea/text-area-component";
import MessageService from "../../services/messageService";

export interface basicComponentProps{
    children: ReactNode;
}
const  BasicComponent  = observer( (props:basicComponentProps)=>{
    // active chat
    const [activeChat, setactiveChat] = useState<Chat | null>()
    const [newMessageContent, setnewMessageContent] = useState('');


    // users chats
    const [chats, setChats] = useState<Chat[]>(UserStore.getChats())
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
                UserStore.setTab('Profile')
            }
        },1000)

    }
    // message box
    const [messageBoxIsOpen, setmessageBoxIsOpen] = useState(false);
    // search
    const [useSearchValue, setSearchValue] = useState('');
    //title
    const [startPost, setStartPost] = useState(false)
    const closeStartPost =()=>{
        setStartPost(false)
    }
    // sidebar options
    const userMainOptions=[
        {type:'fa fa-home', name:'Home'} ,
        {type:'fa fa-message', name:'Messages'} ,
        {type:'fa fa-briefcase', name:'Jobs'} ,
        {type:'fa fa-users', name:'Network'} ,
        {type:'fa fa-plus-circle', name:'New Post'} ,
        {type:'fa fa-bell', name:'Notifications'} ]

    const sideBarMainOptionsHtml = userMainOptions.map((value, index) => (
        <div key={index} style={{display:'flex', justifyContent:'start',flexDirection:'column', gap:'5px', marginInlineStart:'22px'}}>
            <SideBtnComponent iconType={value.type} btnName={t(value.name)} onClick={()=>moveOnSidebar('top',index)}/>
            <br/>
        </div>
    ));
    const bottomMainOptions=[
        {type:'fa fa-user-circle', name:'Profile'} ,
        {type:'fa fa-cog', name:'Settings'} ,
        {type:'fa fa-question-circle', name:t('Help & Support')} ] ;
    const bottomMainOptionsHtml = bottomMainOptions.map((value, index) => (
        <div key={index} style={{display:'flex', justifyContent:'start', flexDirection:'column', gap:'5px', marginInlineStart:'22px'}}>
            <SideBtnComponent iconType={value.type} btnName={t(value.name)}  onClick={()=>moveOnSidebar('down',index)}/>
            <br/>
        </div>
    ));
    const goToUserProfile =  (name:string)=>{
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            navigate(`/profile/${name}`);
            UserStore.setTab("Profile")
        },1000)
    }
    // active chat
    const activateChat=(chat:Chat)=>{
        setactiveChat(chat)
    }
    const closeActiveChat=()=>{
        setactiveChat(null)
    }
    const sendNewMessage = async()=>{
        // getting now timestap
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0'); // Get the current hour and pad with leading zero if necessary
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Get the current minute and pad with leading zero if necessary
        const seconds = String(now.getSeconds()).padStart(2, '0'); // Get the current second and pad with leading zero if necessary
        const currentTime = `${hours}:${minutes}:${seconds}`;

        if(activeChat){
            const newMsg: Message = {content:newMessageContent, sender:userStore.user.id, receiver:activeChat.messages[0].sender!=UserStore.user.id?activeChat.messages[0].sender:activeChat.messages[0].receiver, timestamp:currentTime}
            const result = await MessageService.sendMessageToChat(activeChat._id, newMsg)
            if(result.success)
            {
                setactiveChat(result.chat)
                setnewMessageContent('')
            }

        }
    }
    const setnewMessageContentHandler = (event: any)=>{
        setnewMessageContent(event.target.value)
    }
    const moveOnSidebar=(str:string,index:number)=>{
        if(str=='top') {
            if (index == 4) {
                setStartPost(true)
            } else {
                navigate(`/${userMainOptions[index].name.toLowerCase()}`)
                UserStore.setTab(userMainOptions[index].name)
            }
        }
        if(str=='down') {
            UserStore.setTab(bottomMainOptions[index].name)
            navigate(`/${bottomMainOptions[index].name.toLowerCase()}`);
        }
    }
    return (
        <>
            <span>{UserStore.loggedIn}</span>
            {startPost&&(
            <StartPost isOpen={startPost} onClose={closeStartPost}/>
            )}
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
                                            <h1 className={styles.h2}> {t(UserStore.getTab())}</h1>
                                            <SearchInput placeHolder={t('search...')}  value={useSearchValue} ariaLabel={'Search..'} onChange={(vaalue)=>setSearchValue(vaalue)}/>
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
                                    {/*main context*/}
                                    <div className={styles.right_main}>
                                        <div className={styles.right_main_main}>
                                            {props.children}
                                        </div>
                                        {/*messages*/}
                                        <div className={styles.right_main_messages }>
                                            {/*active chaat*/}
                                            {activeChat?(
                                                <div className={styles.activeChat} >
                                                    <div className={styles.activeChatHeader}>
                                                        <div style={{display:'flex', gap:'5px'}}>
                                                            <div onClick={()=>goToUserProfile(UserStore.getUserInfoById(activeChat.messages[0].sender)?.name!=UserStore.user.name?UserStore.getUserInfoById(activeChat.messages[0].sender)?.name:UserStore.getUserInfoById(activeChat.messages[0].receiver)?.name)}>
                                                            <ProfileImage  name={UserStore.getUserInfoById(activeChat.messages[0].sender)?.name!=UserStore.user.name?UserStore.getUserInfoById(activeChat.messages[0].sender)?.name:UserStore.getUserInfoById(activeChat.messages[0].receiver)?.name}/>
                                                            </div>
                                                                <div style={{display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                                                <span className={styles.simpleP}> {UserStore.getUserInfoById(activeChat.messages[0].sender)?.name!=UserStore.user.name?UserStore.getUserInfoById(activeChat.messages[0].sender)?.name:UserStore.getUserInfoById(activeChat.messages[0].receiver)?.name}</span>
                                                                <span style={{fontSize:'16px', fontWeight:'normal'}} className={styles.simpleP}> {UserStore.getUserInfoById(activeChat.messages[0].sender)?.name!=UserStore.user.name?UserStore.getUserInfoById(activeChat.messages[0].sender)?.about:UserStore.getUserInfoById(activeChat.messages[0].receiver)?.about}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} onClick={()=>closeActiveChat()}> <img src={x} className={styles.x_image}/></div>
                                                    </div>
                                                {/*    messages*/}
                                                    <div style={{padding:'10px',  maxHeight:'700px'}}>
                                                    <div style={{ display:'flex', flexDirection:'column',  maxHeight:'500px', width:'100%', overflowY:'scroll'}}>
                                                        {activeChat?.messages.map((msg:Message, index)=>
                                                            <div  key={index} style={{display:'flex' , justifyContent:'space-between', width:'100%', flexDirection:'column', gap:'30px', marginBottom:'30px'}}>
                                                                {msg.sender==userStore.user.id? (
                                                                        <div style={{display:'flex', justifyContent:'start', width:'100%', gap:'8px'}}>
                                                                            <ProfileImage name={UserStore.user.name}/>
                                                                            <div style={{display:'flex',gap:'10px', flexDirection:'column', alignItems:'start', justifyContent:'center'}}>
                                                                                <span style={{fontSize:'18px',color:'#404141'}} className={globalStyles.simpleP}>{msg.content}</span>
                                                                            </div>
                                                                        </div>
                                                                    ):
                                                                    <div style={{display:'flex', flexDirection:'column'}}>
                                                                        <div style={{display:'flex', justifyContent:'start', width:'100%', gap:'8px'}}>
                                                                            <ProfileImage name={ UserStore.getUserNameById(msg.sender) }/>
                                                                            <div style={{display:'flex',gap:'10px', flexDirection:'column', alignItems:'start', justifyContent:'center'}}>
                                                                                <span style={{fontSize:'18px',color:'#404141'}} className={globalStyles.simpleP}>{msg.content}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    </div>
                                                {/*    send message*/}
                                                    {activeChat?(
                                                        <div style={{width:'100%'}}>
                                                            <div style={{  borderBottom:'1px solid #cfd0d2', marginTop:'10px', width:'100%', display:'flex',justifyContent:'start' }}></div>
                                                            <TextAreaComponent onSendClick={sendNewMessage} onChange={setnewMessageContentHandler} value={newMessageContent} textPlaceHolder={t('Write a message')}/>
                                                        </div>
                                                    ):null}
                                                </div>
                                            ):null}

                                            {/*    open all message box*/}
                                            <div  className={`${styles.fade_in} ${messageBoxIsOpen ? `${styles.allMessagesContainer_visible}` :`${styles.allMessagesContainer_hidden}`}`}>
                                                {/*all user chats*/}
                                                <div className={styles.allMessagesContainer}  >
                                                    {chats.length>0?chats.map((chat:Chat, index)=>
                                                                // chat box
                                                                <div onClick={()=>activateChat(chat)}>
                                                                <div className={styles.messageContainer}>
                                                                    <ProfileImage name={chat.messages[0].sender!=UserStore.user.id? UserStore.getUserNameById(chat.messages[0].sender) : UserStore.getUserNameById(chat.messages[0].receiver)}/>
                                                            <div style={{   display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                                                <span className={styles.simpleP}> {UserStore.getUser().name!=chat.messages[0].sender?UserStore.getUserNameById(chat.messages[0].sender):UserStore.getUserNameById(chat.messages[0].receiver)}</span>
                                                                <span style={{fontSize:'16px', fontWeight:'normal'}} className={styles.simpleP}> {UserStore.getUser().name!=chat.messages[0].sender?UserStore.getUserInfoById(chat.messages[0].sender)?.about:UserStore.getUserInfoById(chat.messages[0].receiver)?.about}</span>
                                                            </div>
                                                            {UserStore.getLanguage()=='en'?( <i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-right" ></i>)
                                                                :(<i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-left"></i>)
                                                            }
                                                        </div>
                                                        <div style={{marginTop:'5px', marginBottom:'15px', marginInlineStart:'15px' ,display:'flex', width:'88%',  borderBottom:'0.5px solid #e8e8e8'}}> </div>
                                                    </div>
                                                    ):null}
                                                </div>


                                            </div>
                                            {/*users chat box*/}
                                            <div  style={{position:'relative', bottom:'20px', width:'40vh', backgroundColor:'white'}} onClick={()=> setmessageBoxIsOpen(!messageBoxIsOpen)}>
                                                <div className={styles.messageContainerMain}>
                                                        <ProfileImage name={UserStore.user.name}/>
                                                        <div style={{display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                                        <span className={styles.simpleP}> {UserStore.getUser().name}</span>
                                                            <span style={{fontSize:'16px', fontWeight:'normal'}} className={styles.simpleP}> {UserStore.getUser().about}</span>
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
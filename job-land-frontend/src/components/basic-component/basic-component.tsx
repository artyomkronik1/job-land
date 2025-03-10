import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import Login from "../login/login";
import componentStyles from './network.module.scss'
import logo from '../../assets/images/icon.jpg'
import styles from "../../assets/global-styles/styles.module.scss";
import SearchInput from "../../base-components/search-input/search-input";
import he from "../../assets/images/languages/he.png";
import en from "../../assets/images/languages/en.png";
import SideBtnComponent from "../../base-components/side-btn/side-btn-component";
import JobFilterBtn from "../../base-components/job-filter-btn/job-filter-btn";
import DropDown from "../../base-components/dropdown-component/dropdown";
import { useNavigate } from "react-router";
import Spinner from "../../base-components/loading-spinner/loading-spinner";
import SignIn from "../signIn/signIn";
import ProfileComponent from "../profile-component/profile-component";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import StartPost from "../../dialogs/start-post/start-post";
import { Chat } from "../../interfaces/chat";
import x from '../../../src/assets/images/x.png';
import userStore from "../../store/user";
import { Message } from "../../interfaces/message";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import TextAreaComponent from "../../base-components/textArea/text-area-component";
import MessageService from "../../services/messageService";
import PostNewJobPopup from "../../dialogs/postNewJob/post-new-job-popup";
import ForgotPassComponent from "../forgotPass-component/forgotPass-component";
import { UserContext } from "../../context/UserContext";

export interface basicComponentProps {
    children: ReactNode;
}
const BasicComponent = observer((props: basicComponentProps) => {
    const UserStore = useContext(UserContext);

    // active chat
    const [activeChat, setactiveChat] = useState<Chat>(UserStore.chats.find((c: Chat) => UserStore.currentChat._id == c._id) as Chat)
    const [newMessageContent, setnewMessageContent] = useState('');

    // users chats
    const [chats, setChats] = useState<Chat[]>(UserStore.chats)
    const navigate = useNavigate();
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };


    // profileSettings

    const [profileSettings, setprofileSettings] = useState('');
    const getSettingAction = (val: string) => {
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            setprofileSettings(val)
            if (val == 'Logout') {
                UserStore.logout();
                navigate('/login')
            }
            else if (val == 'Profile') {
                navigate('/profile')
                UserStore.setTab('Profile')
            }
        }, 1000)

    }
    // updating every time active chat from store
    useEffect(() => {
        setactiveChat(UserStore.currentChat)
    },);

    // message box
    const [messageBoxIsOpen, setmessageBoxIsOpen] = useState(false);
    // search
    const [useSearchValue, setSearchValue] = useState(UserStore.getSearchValue());
    const setSearchValueInput = (value: string) => {

        setSearchValue(value)
    }
    //title
    const [postNewJob, setpostNewJob] = useState(false)

    const [startPost, setStartPost] = useState(false)
    const closeStartPost = () => {
        setStartPost(false)
    }
    const closePostNewJob = () => {
        setpostNewJob(false)
    }
    // sidebar options
    const userMainOptions = [
        { type: 'fa fa-home', name: 'Home' },
        { type: 'fa fa-message', name: 'Messages' },
        { type: 'fa fa-briefcase', name: 'Jobs' },
        { type: 'fa fa-users', name: 'Network' },
        { type: 'fa fa-plus-circle', name: 'New Post' },
        { type: 'fa fa-bell', name: 'Notifications' },
    ]

    // add to hr
    if (UserStore.user.role == "0") {
        userMainOptions.push({ type: 'fa fa-plus-circle', name: 'New Job' })
    }

    if (UserStore.user.role == "0") {
        userMainOptions.push({ type: 'fa fa-file', name: 'Applications' })
    }
    userMainOptions.push({ type: 'fa fa-building', name: 'Companies' }
    )

    const sideBarMainOptionsHtml = userMainOptions.map((value, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'start', flexDirection: 'column', gap: '5px', marginInlineStart: '22px' }}>
            <SideBtnComponent iconType={value.type} btnName={t(value.name)} onClick={() => moveOnSidebar('top', index)} />
            <br />
        </div>
    ));
    const bottomMainOptions = [
        { type: 'fa fa-user-circle', name: 'Profile' },
        // { type: 'fa fa-cog', name: 'Settings' },
        { type: 'fa fa-question-circle', name: t('Help & Support') }];
    const bottomMainOptionsHtml = bottomMainOptions.map((value, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'start', flexDirection: 'column', gap: '5px', marginInlineStart: '22px' }}>
            <SideBtnComponent iconType={value.type} btnName={t(value.name)} onClick={() => moveOnSidebar('down', index)} />
            <br />
        </div>
    ));
    const goToUserProfile = (name: string) => {
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            navigate(`/profile/${name}`);
            UserStore.setTab("Profile")
        }, 1000)
    }
    // active chat
    const activateChat = (chat: Chat) => {

        const currChat = UserStore.chats.find((c: Chat) => c._id == chat._id)
        UserStore.setCurrentChat(currChat as Chat)
    }
    const closeActiveChat = () => {
        setactiveChat({ _id: '', messages: [] })
        UserStore.setCurrentChat({ _id: '', messages: [] })

    }
    const formatTimestampToTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };
    const sendNewMessage = async () => {
        // getting now timestap
        // Getting current timestamp in YYYY-MM-DDTHH:mm:ss format
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const currentTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        if (activeChat && activeChat._id && activeChat._id.length > 0) {
            const newMsg: Message = { content: newMessageContent, sender: userStore.user.id, receiver: activeChat.messages[0].sender != UserStore.user.id ? activeChat.messages[0].sender : activeChat.messages[0].receiver, timestamp: currentTime }
            const result = await MessageService.sendMessageToChat(activeChat._id, newMsg)
            if (result.success) {
                const currChat: Chat = { _id: result.chat._id, messages: result.chat.messages }

                setnewMessageContent('')
                UserStore.setCurrentChat(currChat)
                UserStore.getChatsByUser(UserStore.user.id)


            }

        }

    }

    // setting chats -- updating
    // useEffect(() => {
    //     setChats(UserStore.chats)
    // }, []);
    const setnewMessageContentHandler = (event: any) => {
        setnewMessageContent(event.target.value)
    }


    const getRelativeDateString = (timestamp: string) => {
        const date = new Date(timestamp);
        const currentDate = new Date();

        // Check if the date is today
        if (date.toDateString() === currentDate.toDateString()) {
            return t('Today');
        }

        // Calculate yesterday's date
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);

        // Check if the date is yesterday
        if (date.toDateString() === yesterday.toDateString()) {
            return t('Yesterday');
        }

        const daysOfWeek = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday')];
        const dayOfWeek = daysOfWeek[date.getDay()];

        // Check if the date is within the current month
        const monthNames = [
            t('January'), t('February'), t('March'), t('April'), t('May'), t('June'),
            t('July'), t('August'), t('September'), t('October'), t('November'), t('December')
        ];
        const monthName = monthNames[date.getMonth()];
        const dayOfMonth = date.getDate();

        // Check if the date is within the current year
        const year = date.getFullYear();

        // Check if the date is more than a year ago
        const currentYear = currentDate.getFullYear();

        if (year === currentYear && currentDate.getMonth() + 1 > date.getMonth() + 1) {
            return `${monthName} ${dayOfMonth}`;
        } else if (year === currentYear && currentDate.getMonth() + 1 == date.getMonth() + 1 && currentDate.getDate() - date.getDate() < 7) {
            return `${monthName} ${dayOfMonth}`;
        }
        else {
            return dayOfWeek
        }
    };
    const moveOnSidebar = (str: string, index: number) => {
        if (str == 'top') {
            if (index == 6 && UserStore.user.role == "0") {
                setpostNewJob(true)
            }
            else if (index == 4) {
                setStartPost(true)
            }
            else {
                navigate(`/${userMainOptions[index].name.toLowerCase()}`)
                UserStore.setTab(userMainOptions[index].name)
            }
        }
        if (str == 'down') {
            UserStore.setTab(bottomMainOptions[index].name)
            navigate(`/${bottomMainOptions[index].name.toLowerCase()}`);
        }
    }
    return (
        <>
            {startPost && (
                <StartPost isOpen={startPost} onClose={closeStartPost} />
            )}

            {postNewJob && (
                <PostNewJobPopup isOpen={postNewJob} onClose={closePostNewJob} />
            )}
            {!UserStore.loading ? (
                <>

                    {UserStore.loggedIn && UserStore.signedUp ? (
                        <div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
                            {UserStore.getSessionKey() ? (
                                <div className={styles.main}>
                                    <div className={styles.left}>
                                        <img src={logo} onClick={() => moveOnSidebar('top', 0)} className={styles.logoStyle} style={{ display: 'flex', justifyContent: 'start' }} />
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }} >
                                            {sideBarMainOptionsHtml}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', bottom: '0px', position: 'relative' }} >
                                            {bottomMainOptionsHtml}
                                        </div>
                                    </div>

                                    <div className={styles.right}>
                                        <div className={styles.right_header}>
                                            {/*left side*/}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '80px', justifyContent: 'start' }}>
                                                <h1 className={styles.h2}> {t(UserStore.getTab())}</h1>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <SearchInput placeHolder={t('search...')} value={useSearchValue} ariaLabel={'Search..'} onChange={(vaalue) => setSearchValueInput(vaalue)} />
                                                    <button onClick={() => UserStore.setSearchValue(useSearchValue)} style={{ width: '100px', height: '45px', display: 'flex', gap: '6px', padding: '20px' }} className={globalStyles.btn}>
                                                        <span style={{ color: 'white', fontSize: '16px' }}>{t('Search')}</span>
                                                        <i style={{ color: 'white', fontSize: '16px' }} className="fa fa-search" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            {/*user side*/}
                                            <div className={styles.rightHeader_right} style={{ display: 'flex', gap: '50px', alignItems: 'center', justifyContent: 'end', position: 'absolute' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ cursor: 'pointer' }}>
                                                        <DropDown options={['Profile', 'Logout']} changeDropValue={getSettingAction} icons={['fa fa-user-circle', 'fa fa-sign-out']}>

                                                            <ProfileImage user={UserStore.user} size="small" />

                                                        </DropDown>
                                                    </div>
                                                    <div className={styles.languageDivBasic}>
                                                        {UserStore.getLanguage() == 'en' ?
                                                            <img src={he} className={styles.heLanguagePic} onClick={() => changeLanguage('he')} />
                                                            :
                                                            <img src={en} className={styles.enlanguagePic} onClick={() => changeLanguage('en')} />
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        {/*main context*/}
                                        <div className={styles.right_main}>
                                            <div className={styles.right_main_main} style={{ marginTop: '50px' }}>
                                                {props.children}
                                            </div>
                                            {/*messages*/}
                                            <div className={styles.right_main_messages}>
                                                {/*active chaat*/}
                                                {activeChat && activeChat._id && activeChat._id.length > 0 ? (
                                                    <div className={styles.activeChat} >
                                                        <div className={styles.activeChatHeader}>
                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                <div onClick={() => goToUserProfile(UserStore.getUserInfoById(activeChat.messages[0].sender)?.name != UserStore.user.name ? UserStore.getUserInfoById(activeChat.messages[0].sender)?.name : UserStore.getUserInfoById(activeChat.messages[0].receiver)?.name)}>
                                                                    <ProfileImage user={UserStore.getUserInfoById(activeChat.messages[0].sender)?.name != UserStore.user.name ? UserStore.getUserInfoById(activeChat.messages[0].sender) : UserStore.getUserInfoById(activeChat.messages[0].receiver)} />
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'space-around', gap: '5px' }}>
                                                                    <span className={styles.simpleP}> {UserStore.getUserInfoById(activeChat.messages[0].sender)?.name != UserStore.user.name ? UserStore.getUserInfoById(activeChat.messages[0].sender)?.name : UserStore.getUserInfoById(activeChat.messages[0].receiver)?.name}</span>
                                                                    <span style={{ fontSize: '16px', fontWeight: 'normal', wordBreak: 'break-word', overflow: 'hidden', maxHeight: '30px' }} className={styles.simpleP}> {UserStore.getUserInfoById(activeChat.messages[0].sender)?.name != UserStore.user.name ? UserStore.getUserInfoById(activeChat.messages[0].sender)?.about : UserStore.getUserInfoById(activeChat.messages[0].receiver)?.about}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => closeActiveChat()}> <img src={x} className={styles.x_image} /></div>
                                                        </div>
                                                        {/*    messages*/}
                                                        <div style={{ padding: '10px', maxHeight: '700px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '288px', width: '100%', overflowY: 'scroll' }}>
                                                                {activeChat?.messages.map((msg: Message, index) =>
                                                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'column', gap: '30px', marginBottom: '30px' }}>
                                                                        {msg.sender == userStore.user.id ? (
                                                                            <div style={{ display: 'flex', justifyContent: 'start', width: '100%', gap: '8px' }}>
                                                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

                                                                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', color: '#0a66c2', fontWeight: 'bold', marginBottom: '10px' }}>{getRelativeDateString(msg.timestamp)}</div>


                                                                                    <div style={{ display: 'flex', width: '100%' }}>
                                                                                        <ProfileImage user={UserStore.user} />
                                                                                        <div style={{ marginInlineStart: '5px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'start' }}>
                                                                                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>

                                                                                                <span style={{ fontSize: '15px', color: '#79797a' }} className={globalStyles.simpleP}>{UserStore.getUserNameById(msg.sender)}</span>
                                                                                                <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a' }} className={globalStyles.simpleP}>{'-'}</span>

                                                                                                <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a' }} className={globalStyles.simpleP}>{formatTimestampToTime(msg.timestamp)}</span>
                                                                                            </div>
                                                                                            <span style={{ fontSize: '20px', color: '#404141' }} className={globalStyles.simpleP}>{msg.content}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) :
                                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <div style={{ display: 'flex', justifyContent: 'start', width: '100%', gap: '8px' }}>
                                                                                    <ProfileImage user={UserStore.getUserInfoById(msg.sender)} />
                                                                                    <div style={{ marginInlineStart: '5px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'start' }}>
                                                                                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>

                                                                                            <span style={{ fontSize: '15px', color: '#79797a' }} className={globalStyles.simpleP}>{UserStore.getUserNameById(msg.sender)}</span>
                                                                                            <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a' }} className={globalStyles.simpleP}>{'-'}</span>

                                                                                            <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a' }} className={globalStyles.simpleP}>{msg.timestamp}</span>
                                                                                        </div>
                                                                                        <span style={{ fontSize: '20px', color: '#404141' }} className={globalStyles.simpleP}>{msg.content}</span>
                                                                                    </div>



                                                                                </div>
                                                                            </div>


                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/*    send message*/}
                                                        {activeChat ? (
                                                            <div style={{ width: '100%', position: 'absolute', bottom: '10px' }}>
                                                                <div style={{ borderBottom: '1px solid #cfd0d2', marginTop: '10px', width: '100%', display: 'flex', justifyContent: 'start' }}></div>
                                                                <TextAreaComponent color={'white'} onSendClick={sendNewMessage} onChange={setnewMessageContentHandler} value={newMessageContent} textPlaceHolder={t('Write a message')} />
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                ) : null}

                                                {/*    open all message box*/}

                                                <div className={`${styles.fade_in} ${messageBoxIsOpen ? `${styles.allMessagesContainer_visible}` : `${styles.allMessagesContainer_hidden}`}`}>
                                                    {/*all user chats*/}
                                                    {messageBoxIsOpen && (
                                                        <div className={styles.allMessagesContainer}  >
                                                            {chats.length > 0 ? chats.map((chat: Chat, index) =>
                                                                // chat box
                                                                <div onClick={() => activateChat(chat)}>
                                                                    <div className={styles.messageContainer}>
                                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                                            <ProfileImage user={chat.messages[0].sender != UserStore.user.id ? UserStore.getUserInfoById(chat.messages[0].sender) : UserStore.getUserInfoById(chat.messages[0].receiver)} />
                                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'space-around' }}>
                                                                                <span className={styles.simpleP}> {chat.messages[0].sender != UserStore.user.id ? UserStore.getUserNameById(chat.messages[0].sender) : UserStore.getUserNameById(chat.messages[0].receiver)}</span>
                                                                                <span style={{ fontSize: '16px', fontWeight: 'normal', wordBreak: 'break-word', overflow: 'hidden', maxHeight: '20px' }} className={styles.simpleP}> {chat.messages[0].sender != UserStore.user.id ? UserStore.getUserInfoById(chat.messages[0].sender).about : UserStore.getUserInfoById(chat.messages[0].receiver).about}</span>
                                                                            </div>
                                                                        </div>
                                                                        {UserStore.getLanguage() == 'en' ? (<i style={{ color: '#0a66c2', fontSize: '30px' }} className="fa fa-arrow-circle-right" ></i>)
                                                                            : (<i style={{ color: '#0a66c2', fontSize: '30px' }} className="fa fa-arrow-circle-left"></i>)
                                                                        }
                                                                    </div>
                                                                    <div style={{ marginTop: '5px', marginBottom: '15px', marginInlineStart: '15px', display: 'flex', width: '88%', borderBottom: '0.5px solid #e8e8e8' }}> </div>
                                                                </div>
                                                            ) : null}
                                                        </div>

                                                    )}
                                                </div>

                                                {/*users chat box*/}
                                                {chats && chats.length > 0 && (
                                                    <div style={{ position: 'relative', bottom: '20px', width: '40vh', backgroundColor: 'white' }} onClick={() => setmessageBoxIsOpen(!messageBoxIsOpen)}>
                                                        <div className={styles.messageContainerMain}>
                                                            <ProfileImage user={UserStore.user} />
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'space-around' }}>
                                                                <span className={styles.simpleP} style={{ wordBreak: 'break-word', overflow: 'hidden' }}> {UserStore.getUser().name}</span>
                                                                <span style={{ fontSize: '16px', fontWeight: 'normal', maxHeight: '20px', overflow: 'hidden', wordBreak: 'break-word' }} className={styles.simpleP}> {UserStore.getUser().about}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) :
                                <Login />
                            }
                        </div >
                    ) : UserStore.loggedIn === false && UserStore.forgotPass ? (<ForgotPassComponent />)


                        : UserStore.loggedIn === false && UserStore.signedUp ? (<Login />)
                            : (<SignIn />)}
                </>
            ) : (<Spinner />)}
        </>

    );
})
export default BasicComponent
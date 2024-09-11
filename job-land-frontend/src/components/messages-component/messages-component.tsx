import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import React, { useCallback, useContext, useEffect, useState } from "react";
import globalStyles from '../../assets/global-styles/styles.module.scss'
import styles from './messages.module.scss'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import { Message } from "../../interfaces/message";
import { User } from "../../interfaces/user";
import userStore from "../../store/user";
import { Chat } from "../../interfaces/chat";
import MessageService from "../../services/messageService";
import TextAreaComponent from "../../base-components/textArea/text-area-component";
import Login from "../login/login";
import { useNavigate, useParams } from "react-router";
import SearchInput from "../../base-components/search-input/search-input";
import newmsg from '../../assets/images/newmsg.png'
import { toast } from "react-toastify";
import TextInputField from "../../base-components/text-input/text-input-field";
const MessagesComponent = () => {

    // get all chats
    useEffect(() => {
        UserStore.getChatsByUser(UserStore.user.id)
    }, []);
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [newMessageContent, setnewMessageContent] = useState('');
    const [useSearchValue, setSearchValue] = useState('');
    const [chats, setChats] = useState<Chat[]>(UserStore.getChats())
    const [openChat, setOpenChat] = useState<Chat>()
    const [usersFollowedBy, setusersFollowedBy] = useState<User[]>([]);
    const [newMessage, setnewMessage] = useState<boolean>(false)
    const [searchContactName, setsearchContactName] = useState('');
    const [newChat, setnewChat] = useState<Chat>()
    const [newChatFlag, setnewChatFlag] = useState<boolean>(false)
    const [newUserToChat, setnewUserToChat] = useState<User>()
    const [messageSearch, setmessageSearch] = useState('');
    const navigate = useNavigate();

    const goToUserProfile = (userid: string) => {
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            navigate(`/profile/${userid}`);
            UserStore.setTab("Profile")
        }, 1000)
    }

    // Callback function to filter chats based on message search
    const filterChats = useCallback(() => {
        if (messageSearch.length > 0) {
            const filtered = chats.filter((chat) => {
                return chat.messages.some((message) =>
                    UserStore.user.id !== message.sender && UserStore.getUserInfoById(message.sender).name.toLowerCase().includes(messageSearch.toLowerCase()) ||
                    UserStore.user.id !== message.receiver && UserStore.getUserInfoById(message.receiver).name.toLowerCase().includes(messageSearch.toLowerCase()) ||
                    message.content.toLowerCase().includes(messageSearch.toLowerCase())
                );
            });
            setChats(filtered);
        } else {
            setChats(UserStore.getChats());
        }
    }, [chats, messageSearch]);

    // Callback function to filter users followed by based on contact name search
    const filterUsersFollowedBy = useCallback(() => {
        if (searchContactName.length > 0) {
            const filteredUsers = UserStore.user.follow
                .map((userId: string) => UserStore.getUserInfoById(userId))
                .filter((user: User | undefined) =>
                    user && user.name.toLowerCase().includes(searchContactName.toLowerCase())
                );
            setusersFollowedBy(filteredUsers);
        } else {
            const usersArr: User[] = UserStore.user.follow
                .map((userId: string) => UserStore.getUserInfoById(userId))
                .filter((user: User | undefined) => !!user);
            setusersFollowedBy(usersArr);
        }
    }, [searchContactName]);

    // useEffect to apply filterChats when messageSearch changes
    useEffect(() => {
        filterChats();
    }, [filterChats, messageSearch]);

    // useEffect to apply filterUsersFollowedBy when searchContactName changes
    useEffect(() => {
        filterUsersFollowedBy();
    }, [filterUsersFollowedBy, searchContactName]);

    // show new constacts
    useEffect(() => {
        let usersArr: User[] = []
        UserStore.user.follow.map((user: string) => {
            usersArr.push(UserStore.getUserInfoById(user))
        })
        setusersFollowedBy(usersArr)
    }, []);
    const createNewMessage = () => {

        setnewMessage(true)
        setnewChatFlag(false)

        setOpenChat({ _id: "", messages: [] })
    }
    const openNewChat = async (chat: Chat) => {
        setOpenChat(chat)
        setnewMessage(false)
        setnewChatFlag(false)
    }
    const setnewMessageContentHandler = (event: any) => {
        setnewMessageContent(event.target.value)
    }
    // open new chat and check if this chat is already exsist
    const openNewMessageChat = (user: User) => {
        let flag = false
        let currentChat: Chat = { _id: "", messages: [] }
        chats.map((chat: Chat) => {
            chat.messages.map((msg: Message) => {
                if (msg.sender == user.id || msg.receiver == user.id) {
                    currentChat = chat;
                    flag = true;
                }
            })


        })
        if (!flag) {
            setnewChatFlag(true)
            setnewUserToChat(user)
        }
        else if (flag) {
            openNewChat(currentChat)
        }
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

        if (year === currentYear) {
            return dayOfWeek;
        } else {
            return `${monthName} ${dayOfMonth}`;
        }
    };
    const sendNewMessageToNewChat = async () => {
        // Getting current timestamp in YYYY-MM-DDTHH:mm:ss format
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const currentTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        if (newUserToChat) {
            let newmsg = {
                sender: UserStore.user.id,
                receiver: newUserToChat.id,
                content: newMessageContent,
                timestamp: currentTime
            };

            const result = await MessageService.sendMessageToNewChat(newmsg);

            if (result.success) {
                UserStore.setLoading(true);
                toast.success(t('SUCCESS'));
                setTimeout(() => {
                    UserStore.setLoading(false);
                }, 3000);
            }

            await UserStore.getChatsByUser(UserStore.user.id);
            setChats(UserStore.getChats());
        }
    };


    const sendNewMessage = async () => {
        // Getting current timestamp in YYYY-MM-DDTHH:mm:ss format
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const currentTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        if (openChat) {
            const newMsg = {
                content: newMessageContent,
                sender: userStore.user.id,
                receiver: openChat.messages[0].sender !== UserStore.user.id ? openChat.messages[0].sender : openChat.messages[0].receiver,
                timestamp: currentTime
            };

            const result = await MessageService.sendMessageToChat(openChat._id, newMsg);

            if (result.success) {
                setOpenChat(result.chat);
                setnewMessageContent('');
                await UserStore.getChatsByUser(UserStore.user.id);
            }
        }
    };
    const formatTimestampToTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const checkDate = (chat: Chat, msg: Message) => {
        let res = true;
        const date = new Date(msg.timestamp);

        const year = String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
        const day = String(date.getDate()).padStart(2, '0');

        const hours = parseInt(String(date.getHours()).padStart(2, '0'), 10);
        const minutes = parseInt(String(date.getMinutes()).padStart(2, '0'), 10);
        const seconds = parseInt(String(date.getSeconds()).padStart(2, '0'), 10);


        // chat.messages.forEach(m => {
        //     if (
        //         (m.content !== msg.content && m.receiver == msg.receiver && m.sender === msg.sender && String(new Date(m.timestamp).getDate()).padStart(2, '0') == day && String(new Date(m.timestamp).getMonth() + 1).padStart(2, '0') == month && String(new Date(m.timestamp).getFullYear()).padStart(2, '0') == year) && (parseInt(String(new Date(m.timestamp).getHours()).padStart(2, '0')) > hours)) {
        //         console.log(m.content);

        //         res = true
        //     }

        //     else if (
        //         (m.content !== msg.content && m.receiver == msg.receiver && m.sender === msg.sender && parseInt(String(new Date(m.timestamp).getDate()).padStart(2, '0')) != day && String(new Date(m.timestamp).getMonth() + 1).padStart(2, '0') == month && String(new Date(m.timestamp).getFullYear()).padStart(2, '0') == year) && (parseInt(String(new Date(m.timestamp).getHours()).padStart(2, '0')) > hours)) {
        //         console.log(m.content);

        //         res = true
        //     }


        // });
        return res;

    }
    return (
        <>
            <div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
                <div style={{ marginTop: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >
                    {/*    messages container*/}
                    {/*    title*/}
                    <div style={{ backgroundColor: 'white', width: '100%', height: '150px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                            <h1 style={{ paddingLeft: '20px', paddingRight: '20px', color: '#0a66c2' }}>{t('Messaging')}</h1>
                            {chats && chats.length > 0 && (<SearchInput placeHolder={t('search for a message')} value={messageSearch} ariaLabel={'Search..'} onChange={(vaalue) => setmessageSearch(vaalue)} />
                            )}
                        </div>
                        <div className={styles.newMsgPic} onClick={createNewMessage} >
                            <img width={30} height={30} src={newmsg} />
                        </div>
                    </div>
                    <div style={{ borderBottom: '1px solid #cfd0d2', width: '100%', display: 'flex', justifyContent: 'start' }}>
                    </div>

                    {chats.length > 0 ? (
                        <div className={styles.messagesContainer}  >

                            <div className={styles.messagesContainer__leftSide}>
                                {chats.map((chat: Chat, index) =>

                                    <div style={{ cursor: 'pointer' }} key={index} className={styles.messagesContainer__leftSide__messageBox} onClick={() => openNewChat(chat)} >
                                        <div className={chat._id == openChat?._id ? styles.openedChat : styles.closedChat} style={{ paddingBottom: '30px', paddingTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', gap: '10px', paddingLeft: '10px', paddingRight: '10px' }}>
                                                <ProfileImage user={chat.messages[0].sender != UserStore.user.id ? UserStore.getUserInfoById(chat.messages[0].sender) : UserStore.getUserInfoById(chat.messages[0].receiver)} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'start' }}>
                                                    <span style={{ fontSize: '15px', color: '#404141' }} className={globalStyles.simpleP}>{UserStore.user.id != chat.messages[0].receiver ? UserStore.getUserNameById(chat.messages[0].receiver) : UserStore.getUserNameById(chat.messages[0].sender)}</span>
                                                    <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a', wordBreak: 'break-word', overflow: 'hidden', maxHeight: '15px' }} className={globalStyles.simpleP}>{UserStore.user.id != chat.messages[0].receiver ? UserStore.getUserInfoById(chat.messages[0].receiver)?.about : UserStore.getUserInfoById(chat.messages[0].sender)?.about}</span>

                                                </div>
                                            </div>

                                        </div>
                                        <div style={{ borderBottom: '1px solid #cfd0d2', width: '100%', display: 'flex', justifyContent: 'start' }}>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.messagesContainer__rightSide}>
                                {/* {openChat && !newMessage && (
                                    <div style={{ marginBottom: '20px', borderBottom: '1px solid #dcdcdc', position: 'relative', display: 'flex', width: '100%', paddingLeft: '80px', height: '40px', background: 'white', alignItems: 'baseline', marginTop: '-20px' }}>
                                        <span style={{ marginRight: '20px', marginLeft: '20px', color: 'rgb(64, 65, 65)', fontSize: '20px', fontWeight: 'bold' }}>{UserStore.user.id == openChat.messages[0].sender ? UserStore.getUserInfoById(openChat.messages[0].receiver).name : UserStore.getUserInfoById(openChat.messages[0].sender).name}</span>
                                    </div>
                                )} */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%' }}>

                                    {/*// new message*/}
                                    {openChat?._id == "" && newMessage ? (
                                        <div style={{ display: 'flex', marginTop: '-20px', flexDirection: 'column', width: '100%' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                <h2 style={{ display: 'flex', justifyContent: 'start', paddingLeft: '20px', paddingRight: '20px', color: '#0a66c2' }}>{t('New chat')}</h2>
                                                <div style={{ marginTop: '18px', borderBottom: '1px solid #cfd0d2', width: '100%', display: 'flex', justifyContent: 'start' }}></div>
                                            </div>
                                            {openChat?._id == "" && newMessage && !newChatFlag && (
                                                <div style={{ display: 'flex', width: '100%', marginTop: '40px', flexDirection: 'column' }}>
                                                    <SearchInput placeHolder={t('Type a name...')} value={searchContactName} ariaLabel={t('Type a name')} onChange={setsearchContactName} />
                                                    <div style={{ marginTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '25px', border: '1px solid #cfd0d2', height: '60%', overflowY: 'auto' }}>
                                                        <div style={{ overflowY: 'scroll' }}>
                                                            {usersFollowedBy.length > 0 ? usersFollowedBy.map((user: User, index) =>
                                                                <div key={index}  >


                                                                    {/*<div className={globalStyles.separate_line_grey} style={{marginBottom:'50px' ,width:'110%' }}></div>*/}
                                                                    <div style={{ cursor: 'pointer' }} className={styles.messagesContainer__leftSide__messageBox} onClick={() => openNewMessageChat(user)} >
                                                                        <div className={styles.closedChat} style={{ paddingBottom: '30px', paddingTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', gap: '10px', paddingLeft: '10px', paddingRight: '10px' }}>
                                                                                <ProfileImage user={user} />
                                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'start' }}>
                                                                                    <span style={{ fontSize: '15px', color: '#404141' }} className={globalStyles.simpleP}>{user.name}</span>
                                                                                    <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a', wordBreak: 'break-word', overflow: 'hidden', maxHeight: '15px' }} className={globalStyles.simpleP}>{user.about}</span>

                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div style={{ borderBottom: '1px solid #cfd0d2', width: '100%', display: 'flex', justifyContent: 'start' }}></div>
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                </div>
                                            )}
                                            {openChat?._id == "" && newMessage && newChatFlag && newUserToChat && (
                                                <div style={{ marginTop: '50px' }}>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        {/*write a new msg*/}
                                                        <ProfileImage user={newUserToChat} />
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'start' }}>
                                                            <span style={{ fontSize: '15px', color: '#404141' }} className={globalStyles.simpleP}>{newUserToChat.name}</span>
                                                            <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a', wordBreak: 'break-word', overflow: 'hidden', maxHeight: '15px' }} className={globalStyles.simpleP}>{newUserToChat.about}</span>

                                                        </div>

                                                    </div>
                                                    <div style={{ width: '100%', marginTop: '40px' }}>
                                                        <div style={{ paddingBottom: '5px', borderBottom: '1px solid #cfd0d2', marginBottom: '15px', width: '100%', display: 'flex', justifyContent: 'start' }}></div>
                                                        <TextAreaComponent color={'grey'} onSendClick={sendNewMessageToNewChat} onChange={setnewMessageContentHandler} value={newMessageContent} textPlaceHolder={t('Write a message')} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : null}

                                    {/*messages*/}

                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxHeight: '50vh', overflowY: 'scroll' }}>

                                        {openChat && !newMessage ? openChat?.messages.map((msg: Message, index) =>

                                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'column', gap: '30px', marginBottom: '40px' }}>
                                                {msg.sender == userStore.user.id ? (


                                                    <div style={{ justifyContent: 'start', width: '100%', gap: '8px' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            {checkDate(openChat, msg) === true && (
                                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', color: '#0a66c2', fontWeight: 'bold', marginBottom: '10px' }}>{getRelativeDateString(msg.timestamp)}</div>

                                                            )}
                                                            <div style={{ display: 'flex', width: '100%' }}>
                                                                <div onClick={() => goToUserProfile(UserStore.user.id)}>    <ProfileImage user={UserStore.user} /></div>
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

                                                            <div onClick={() => goToUserProfile(UserStore.getUserInfoById(msg.sender))}>    <ProfileImage user={UserStore.getUserInfoById(msg.sender)} /></div>

                                                            <div style={{ marginInlineStart: '5px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'baseline' }}>
                                                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'start', justifyContent: 'center' }}>

                                                                    <span style={{ fontSize: '15px', color: '#79797a' }} className={globalStyles.simpleP}>{UserStore.getUserNameById(msg.sender)}</span>
                                                                    <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a' }} className={globalStyles.simpleP}>{'-'}</span>

                                                                    <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a' }} className={globalStyles.simpleP}>{msg.timestamp}</span>
                                                                </div>
                                                                <span style={{ fontSize: '20px', color: '#404141' }} className={globalStyles.simpleP}>{msg.content}</span>
                                                            </div>
                                                        </div>
                                                    </div>}
                                            </div>) : null}




                                    </div>
                                    {/*send message*/}
                                    {openChat && !newMessage ? (
                                        <div style={{ width: '100%' }}>
                                            <div style={{ paddingBottom: '5px', borderBottom: '1px solid #cfd0d2', marginBottom: '15px', width: '100%', display: 'flex', justifyContent: 'start' }}></div>
                                            <TextAreaComponent color={'grey'} onSendClick={sendNewMessage} onChange={setnewMessageContentHandler} value={newMessageContent} textPlaceHolder={t('Write a message')} />
                                        </div>
                                    ) : null}
                                </div>

                            </div>

                        </div>


                    ) : (
                        <div style={{ background: 'white', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            {!newMessage && (
                                <span className={globalStyles.simpleP} style={{ marginTop: '50px', marginBottom: '50px', fontSize: '35px' }}>    {t("There is no messages")}</span>

                            )}




                            {/*// new message*/}
                            {openChat?._id == "" && newMessage ? (
                                <div style={{ display: 'flex', marginTop: '-20px', flexDirection: 'column', padding: '10px', width: '100%' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <h2 style={{ display: 'flex', justifyContent: 'start', paddingLeft: '20px', paddingRight: '20px', color: '#0a66c2' }}>{t('New chat')}</h2>
                                        <div style={{ marginTop: '18px', borderBottom: '1px solid #cfd0d2', width: '100%', display: 'flex', justifyContent: 'start' }}></div>
                                    </div>
                                    {openChat?._id == "" && newMessage && !newChatFlag && (
                                        <div style={{ display: 'flex', width: '100%', marginTop: '40px', flexDirection: 'column' }}>
                                            <SearchInput placeHolder={t('Type a name...')} value={searchContactName} ariaLabel={t('Type a name')} onChange={setsearchContactName} />
                                            <div style={{ marginTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '25px', border: '1px solid #cfd0d2', height: '100%' }}>
                                                <div style={{ overflowY: 'scroll' }}>
                                                    {usersFollowedBy.length > 0 ? usersFollowedBy.map((user: User, index) =>
                                                        <div key={index}  >


                                                            {/*<div className={globalStyles.separate_line_grey} style={{marginBottom:'50px' ,width:'110%' }}></div>*/}
                                                            <div style={{ cursor: 'pointer' }} className={styles.messagesContainer__leftSide__messageBox} onClick={() => openNewMessageChat(user)} >
                                                                <div className={styles.closedChat} style={{ paddingBottom: '30px', paddingTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', gap: '10px', paddingLeft: '10px', paddingRight: '10px' }}>
                                                                        <ProfileImage user={user} />
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'start' }}>
                                                                            <span style={{ fontSize: '15px', color: '#404141' }} className={globalStyles.simpleP}>{user.name}</span>
                                                                            <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a', wordBreak: 'break-word', overflow: 'hidden', maxHeight: '15px' }} className={globalStyles.simpleP}>{user.about}</span>

                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div style={{ borderBottom: '1px solid #cfd0d2', width: '100%', display: 'flex', justifyContent: 'start' }}></div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                    {openChat?._id == "" && newMessage && newChatFlag && newUserToChat && (
                                        <div style={{ marginTop: '50px' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {/*write a new msg*/}
                                                <ProfileImage user={newUserToChat} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'start' }}>
                                                    <span style={{ fontSize: '15px', color: '#404141' }} className={globalStyles.simpleP}>{newUserToChat.name}</span>
                                                    <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#79797a', wordBreak: 'break-word', overflow: 'hidden', maxHeight: '15px' }} className={globalStyles.simpleP}>{newUserToChat.about}</span>

                                                </div>

                                            </div>
                                            <div style={{ width: '100%', marginTop: '40px' }}>
                                                <div style={{ paddingBottom: '5px', borderBottom: '1px solid #cfd0d2', marginBottom: '15px', width: '100%', display: 'flex', justifyContent: 'start' }}></div>
                                                <TextAreaComponent color={'grey'} onSendClick={sendNewMessageToNewChat} onChange={setnewMessageContentHandler} value={newMessageContent} textPlaceHolder={t('Write a message')} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>

            </div>
        </>

    );
}
export default MessagesComponent
import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import globalStyles from '../../assets/global-styles/styles.module.scss'
import styles from './messages.module.scss'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import {Message} from "../../interfaces/message";
import {User} from "../../interfaces/user";
import userStore from "../../store/user";
import {Chat} from "../../interfaces/chat";
import MessageService from "../../services/messageService";
import TextAreaComponent from "../../base-components/textArea/text-area-component";
import Login from "../login/login";
import {useParams} from "react-router";
const  MessagesComponent  = ()=> {

    // get all chats
    useEffect(() => {
        UserStore.getChatsByUser(UserStore.user.id)
    } );
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [newMessageContent, setnewMessageContent] = useState('');
    const [useSearchValue, setSearchValue] = useState('');
    const [chats, setChats] = useState<Chat[]>(UserStore.getChats())
    const [openChat, setOpenChat] = useState<Chat>()

    const openNewChat = async(chat:Chat)=>{
        setOpenChat(chat)
    }
    const setnewMessageContentHandler = (event: any)=>{
        setnewMessageContent(event.target.value)
    }
    const sendNewMessage = async()=>{
        // getting now timestap
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0'); // Get the current hour and pad with leading zero if necessary
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Get the current minute and pad with leading zero if necessary
        const seconds = String(now.getSeconds()).padStart(2, '0'); // Get the current second and pad with leading zero if necessary
        const currentTime = `${hours}:${minutes}:${seconds}`;

        if(openChat){
            const newMsg: Message = {content:newMessageContent, sender:userStore.user.id, receiver:openChat.messages[0].sender!=UserStore.user.id?openChat.messages[0].sender:openChat.messages[0].receiver, timestamp:currentTime}
            const result = await MessageService.sendMessageToChat(openChat._id, newMsg)
            if(result.success)
            {
                setOpenChat(result.chat)
                setnewMessageContent('')
            }

        }
    }
    return (
        <>
            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                <div style={{ marginTop:'90px',display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100vh'}} >
                {/*    messages container*/}

                    {chats.length>0?chats.map((chat:Chat, index)=>
                        <div className={styles.messagesContainer} key={index} onClick={()=>openNewChat(chat)} >
                            <div className={styles.messagesContainer__leftSide}>
                                    {/*<div className={globalStyles.separate_line_grey} style={{marginBottom:'50px' ,width:'110%' }}></div>*/}
                                <div className={styles.messagesContainer__leftSide__messageBox}>
                                    <div style={{display:'flex',alignItems:'center', justifyContent:'space-between', width:'100%'  }}>
                                            <div style={{display:'flex', flexDirection:'row', alignItems:'start', gap:'10px'}}>
                                            <ProfileImage name={chat.messages[0].sender!=UserStore.user.id? UserStore.getUserNameById(chat.messages[0].sender) : UserStore.getUserNameById(chat.messages[0].receiver)}/>
                                            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                                             <span style={{fontSize:'15px', color:'#404141'}} className={globalStyles.simpleP}>{UserStore.user.id!=chat.messages[0].receiver ? UserStore.getUserNameById(chat.messages[0].receiver) :  UserStore.getUserNameById(chat.messages[0].sender)}</span>
                                            </div>
                                          </div>

                                    </div>
                                    <div style={{  paddingBottom:'20px', borderBottom:'1px solid #cfd0d2',marginBottom:'50px', width:'100%', display:'flex',justifyContent:'start' }}>
                                    </div>
                                </div>

                            </div>
                            <div className={styles.messagesContainer__rightSide}>
                                <div style={{ display:'flex' , flexDirection:'column', alignItems:'start', width:'100%'}}>
                                    {/*title of the chat*/}
                                    {openChat ? (
                                        <div style={{display:'flex',alignItems:'start', justifyContent:'space-between', width:'100%' ,flexDirection:'column'  }}>
                                            <div style={{display:'flex', flexDirection:'row', alignItems:'start', gap:'10px'}}>
                                                <div style={{display:'flex', flexDirection:'column', gap:'10px', alignItems:'start'}}>
                                                    <span style={{fontSize:'15px', color:'#404141'}} className={globalStyles.simpleP}>{UserStore.user.id!=openChat.messages[0].receiver ? UserStore.getUserNameById(openChat.messages[0].receiver) :  UserStore.getUserNameById(openChat.messages[0].sender)}</span>
                                                    <span style={{fontSize:'13px', fontWeight:'normal', color:'#79797a'}} className={globalStyles.simpleP}>{UserStore.user.id!=openChat.messages[0].receiver ? UserStore.getUserInfoById(openChat.messages[0].receiver)?.about :  UserStore.getUserInfoById(openChat.messages[0].sender)?.about}</span>

                                                </div>
                                            </div>
                                            <div style={{  paddingBottom:'20px', borderBottom:'1px solid #cfd0d2',marginBottom:'50px', width:'100%', display:'flex',justifyContent:'start' }}>
                                            </div>
                                        </div>

                                    ):null}
                                    {/*messages*/}
                                    <div style={{display:'flex', flexDirection:'column', width:'100%', maxHeight:'700px', overflowY:'scroll'}}>
                                    {openChat?.messages.map((msg:Message, index)=>
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
                                    {/*send message*/}
                                    {openChat?(
                                        <div style={{width:'100%'}}>
                                            <div style={{  paddingBottom:'5px', borderBottom:'1px solid #cfd0d2',marginBottom:'15px', width:'100%', display:'flex',justifyContent:'start' }}></div>
                                            <TextAreaComponent onSendClick={sendNewMessage} onChange={setnewMessageContentHandler} value={newMessageContent} textPlaceHolder={t('Write a message')}/>
                                        </div>
                                        ):null}
                                </div>

                            </div>

                            </div>


                    ):(
                        <div>
                            <span className={globalStyles.simpleP}>         There is no messages</span>

                        </div>
                    )}
                </div>

            </div>
        </>

    );
}
export default MessagesComponent
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
const  MessagesComponent  = observer( ()=>{
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [useSearchValue, setSearchValue] = useState('');
    const [chats, setChats] = useState<Chat[]>(UserStore.getChats())
    const [openChat, setOpenChat] = useState<Chat>()
    const openNewChat = async(chat:Chat)=>{
        setOpenChat(chat)
        console.log(openChat)
    }
    // useEffect(() => {
    //     const effect = async ()=> {
    //         if(openChat) {
    //             if ( openChat.receiver != UserStore.user.id) {
    //                await UserStore.getMessagesByPersons(openChat.receiver)
    //                 console.log('a',UserStore.getCurrentChat())
    //             } else {
    //                 await UserStore.getMessagesByPersons(openChat.sender)
    //                 console.log('a',UserStore.getCurrentChat())
    //             }
    //         }}
    // }, [openChat]);
    return (
        <>
            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                <div style={{marginTop:'90px',display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100vh'}} >
                {/*    messages container*/}

                    {chats.map((chat:Chat, index)=>
                        <div className={styles.messagesContainer} key={index} onClick={()=>openNewChat(chat)} >
                            <div className={styles.messagesContainer__leftSide}>
                                <div style={{ paddingLeft:'20px', paddingBottom:'20px', borderBottom:'1px solid #cfd0d2',marginBottom:'50px', width:'109%', display:'flex',justifyContent:'start' }}>
                                <span  style={{color:'#a9acb1', fontSize:'22px'}} className={globalStyles.simpleP}>{t('Messaging')}</span>
                                </div>
                                    {/*<div className={globalStyles.separate_line_grey} style={{marginBottom:'50px' ,width:'110%' }}></div>*/}
                                <div className={styles.messagesContainer__leftSide__messageBox}>
                                    <div style={{display:'flex',alignItems:'center', justifyContent:'space-between', width:'100%'  }}>
                                          <div style={{display:'flex', flexDirection:'row', alignItems:'start', gap:'10px'}}>
                                            <ProfileImage name={chat.messages[0].sender!=UserStore.user.id? UserStore.getUserNameById(chat.messages[0].sender) : UserStore.getUserNameById(chat.messages[0].receiver)}/>
                                             <span style={{fontSize:'22px', color:'#404141'}} className={globalStyles.simpleP}>{UserStore.getUserNameById(chat.messages[0].receiver)}</span>
                                          </div>
                                              <i className={`fa fa-arrow-circle-right ${styles.arrowIcon} `} aria-hidden="true"></i>
                                    </div>
                                    {/*<div style={{display:'flex',  justifyContent:'center' }}>*/}
                                    {/*    <div style={{ width:'100%'}} className={globalStyles.separate_line_grey}></div>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                            <div className={styles.messagesContainer__rightSide}>
                                <div className={styles.messagesContainer__rightSide__header} style={{ marginBottom:'50px', paddingLeft:'20px', paddingBottom:'20px', borderBottom:'1px solid #cfd0d2', width:'103%', display:'flex',justifyContent:'start' }}>
                                    <span  style={{color:'#a9acb1', fontSize:'22px'}} className={globalStyles.simpleP}>{UserStore.getUserNameById(chat.messages[0].receiver)}</span>
                                </div>
                                <div style={{height:'100%', display:'flex' , flexDirection:'column', alignItems:'start', width:'100%'}}>
                                {openChat?.messages.map((msg:Message, index)=>
                                    <div style={{display:'flex' , justifyContent:'space-between', width:'100%', flexDirection:'column', gap:'30px', marginBottom:'30px'}}>
                                        {msg.sender==userStore.user.id? (
                                            <div style={{display:'flex', justifyContent:'start', width:'100%', gap:'8px'}}>
                                                <ProfileImage name={msg.sender==UserStore.user.id? UserStore.getUserNameById(msg.sender) : UserStore.getUserNameById(msg.receiver)}/>
                                                <div style={{display:'flex',gap:'10px', flexDirection:'column', alignItems:'start', justifyContent:'center'}}>
                                                    <span style={{fontSize:'18px', color:'#404141'}} className={globalStyles.simpleP}>{msg.sender==UserStore.user.id? UserStore.getUserNameById(msg.sender) : UserStore.getUserNameById(msg.receiver)}</span>
                                                    <span style={{fontSize:'18px',color:'#404141'}} className={globalStyles.simpleP}>{msg.content}</span>
                                                </div>
                                            </div>
                                        ):
                                            
                                        <div style={{display:'flex', justifyContent:'start', width:'100%', gap:'8px'}}>
                                            <ProfileImage name={msg.sender!=UserStore.user.id? UserStore.getUserNameById(msg.sender) : UserStore.getUserNameById(msg.receiver)}/>
                                           <div style={{display:'flex',gap:'10px', flexDirection:'column', alignItems:'start', justifyContent:'center'}}>
                                            <span style={{fontSize:'18px',color:'#404141'}} className={globalStyles.simpleP}>{msg.sender!=UserStore.user.id? UserStore.getUserNameById(msg.sender) : UserStore.getUserNameById(msg.receiver)}</span>
                                            <span style={{fontSize:'18px',color:'#404141'}} className={globalStyles.simpleP}>{msg.content}</span>
                                           </div>
                                        </div>
                                        }
                                    </div>
                                )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </>

    );
} )
export default MessagesComponent
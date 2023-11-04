import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import globalStyles from '../../assets/global-styles/styles.module.scss'
import styles from './messages.module.scss'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import {Message} from "../../interfaces/message";
import {User} from "../../interfaces/user";
const  MessagesComponent  = observer( ()=>{
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [useSearchValue, setSearchValue] = useState('');
    const [chats, setChats] = useState<Message[]>(UserStore.getMessages())
    const [openChat, setOpenChat] = useState<Message>()
    return (
        <>
            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                <div style={{marginTop:'90px',display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100vh'}} >
                {/*    messages container*/}
                    {chats.map((chat:Message, index)=>
                        <div className={styles.messagesContainer} key={index} onClick={()=>setOpenChat(chat)}>
                            <div className={styles.messagesContainer__leftSide}>
                                <div className={styles.messagesContainer__leftSide__messageBox}>
                                    <div style={{display:'flex',alignItems:'center', justifyContent:'space-between', width:'100%', paddingLeft:'10px', paddingRight:'10px'   }}>
                                          <div style={{display:'flex', flexDirection:'row', alignItems:'start', gap:'10px'}}>
                                            <ProfileImage name={chat.sender!=UserStore.user.id? UserStore.getUserNameById(chat.sender) : UserStore.getUserNameById(chat.receiver)}/>
                                             <span style={{fontSize:'22px'}} className={globalStyles.simpleP}>{UserStore.getUserNameById(chat.receiver)}</span>
                                          </div>
                                              <i className={`fa fa-arrow-circle-right ${styles.arrowIcon} `} aria-hidden="true"></i>
                                    </div>
                                    <div style={{display:'flex', justifyContent:'center',paddingLeft:'10px', paddingRight:'10px' }}>
                                        <div className={globalStyles.separate_line_grey}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.messagesContainer__rightSide}>
                                <div style={{display:'flex'}}></div>

                            </div>
                        </div>
                    )}
                </div>

            </div>
        </>

    );
} )
export default MessagesComponent
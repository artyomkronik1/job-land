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
import SearchInput from "../../base-components/search-input/search-input";
import newmsg from '../../assets/images/newmsg.png'
import {toast} from "react-toastify";
const  MessagesComponent  = ()=> {

    // get all chats
    useEffect(() => {
        UserStore.getChatsByUser(UserStore.user.id)
    },[] );
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

    // filtered new contacts
    useEffect(() => {
        if(searchContactName.length>0) {
            const filteredUsers = usersFollowedBy.filter(user => user.name.includes(searchContactName));
            setusersFollowedBy(filteredUsers)
        }
        else{
            let usersArr:User[]=[]
            UserStore.user.follow.map((user:string)=>{
                usersArr.push(UserStore.getUserInfoById(user))
            })
            setusersFollowedBy(usersArr)
        }
    }, [searchContactName]);
    // show new constacts
    useEffect(() => {
        let usersArr:User[]=[]
            UserStore.user.follow.map((user:string)=>{
                usersArr.push(UserStore.getUserInfoById(user))
            })
        setusersFollowedBy(usersArr)
    }, []);
    const createNewMessage = ()=>{
        setnewMessage(true)
        setnewChatFlag(false)

        setOpenChat({_id:"", messages:[]})
    }
    const openNewChat = async(chat:Chat)=>{
        setOpenChat(chat)
        setnewMessage(false)
        setnewChatFlag(false)
    }
    const setnewMessageContentHandler = (event: any)=>{
        setnewMessageContent(event.target.value)
    }
    const openNewMessageChat =(user:User)=>{
        let flag = false
        let currentChat:Chat={_id:"", messages:[]}
        chats.map((chat:Chat)=>{
            chat.messages.map((msg:Message)=>{
                if(msg.sender== user.id || msg.receiver==user.id){
                    currentChat = chat;
                    flag= true;
                }
                })


            })

        console.log(flag)
        if(!flag) {
            setnewChatFlag(true)
            setnewUserToChat(user)
        }
        else if (flag){
            openNewChat(currentChat)
        }
    }
    const sendNewMessageToNewChat = async()=>{
        // getting now timestap
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0'); // Get the current hour and pad with leading zero if necessary
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Get the current minute and pad with leading zero if necessary
        const seconds = String(now.getSeconds()).padStart(2, '0'); // Get the current second and pad with leading zero if necessary
        const currentTime = `${hours}:${minutes}:${seconds}`;
        if(newUserToChat) {
            let newmsg: Message = {sender: UserStore.user.id, receiver: newUserToChat.id, content:newMessageContent, timestamp: currentTime}
            const result = await MessageService.sendMessageToNewChat(newmsg)
            if(result.success){
                UserStore.setLoading(true);
                toast.success(t('SUCCESS'));
                setTimeout(() => {
                    UserStore.setLoading(false);
                }, 3000);

            }
            await         UserStore.getChatsByUser(UserStore.user.id);
            setChats(UserStore.getChats())


        }

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
                await UserStore.getChatsByUser(UserStore.user.id)


            }

        }
    }
    return (
        <>
            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                <div style={{ marginTop:'90px',display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100vh'}} >
                {/*    messages container*/}
                {/*    title*/}
                    <div style={{backgroundColor:'white' , width:'100%', height:'150px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <h1 style={{paddingLeft:'20px',paddingRight:'20px', color:'#a9acb1'}}>{t('Messaging')}</h1>
                        <img style={{marginRight:'50px',marginLeft:'50px', cursor:'pointer'}} width={30} height={30} src={newmsg} onClick={createNewMessage}/>
                    </div>
                    <div style={{  borderBottom:'1px solid #cfd0d2', width:'100%', display:'flex',justifyContent:'start' }}>
                    </div>

                    {chats.length>0?(
                        <div className={styles.messagesContainer}  >

                            <div className={styles.messagesContainer__leftSide}>
                                {chats.map((chat:Chat, index)=>

                                <div key={index} className={styles.messagesContainer__leftSide__messageBox} onClick={()=>openNewChat(chat)} >
                                    <div  className={chat._id==openChat?._id? styles.openedChat:styles.closedChat} style={{paddingBottom:'30px', paddingTop:'30px' ,display:'flex',alignItems:'center', justifyContent:'space-between', width:'100%'  }}>
                                            <div style={{display:'flex', flexDirection:'row', alignItems:'start', gap:'10px', paddingLeft:'10px', paddingRight:'10px'}}>
                                            <ProfileImage name={chat.messages[0].sender!=UserStore.user.id? UserStore.getUserNameById(chat.messages[0].sender) : UserStore.getUserNameById(chat.messages[0].receiver)}/>
                                            <div style={{display:'flex', flexDirection:'column', gap:'10px', alignItems:'start'}}>
                                             <span style={{fontSize:'15px', color:'#404141'}} className={globalStyles.simpleP}>{UserStore.user.id!=chat.messages[0].receiver ? UserStore.getUserNameById(chat.messages[0].receiver) :  UserStore.getUserNameById(chat.messages[0].sender)}</span>
                                                                <span style={{fontSize:'13px', fontWeight:'normal', color:'#79797a'}} className={globalStyles.simpleP}>{UserStore.user.id!=chat.messages[0].receiver ? UserStore.getUserInfoById(chat.messages[0].receiver)?.about :  UserStore.getUserInfoById(chat.messages[0].sender)?.about}</span>

                                            </div>
                                          </div>

                                    </div>
                                    <div style={{  borderBottom:'1px solid #cfd0d2', width:'100%', display:'flex',justifyContent:'start' }}>
                                    </div>
                                </div>
                            )}
                            </div>
                            <div className={styles.messagesContainer__rightSide}>
                                <div style={{ display:'flex' , flexDirection:'column', alignItems:'start', width:'100%'}}>

                                    {/*// new message*/}
                                    {openChat?._id=="" &&newMessage? (
                                    <div style={{display:'flex', marginTop:'-20px', flexDirection:'column', width:'100%'}}>
                                        <div style={{display:'flex', flexDirection:'column' , width:'100%'}}>
                                            <h2 style={{display:'flex', justifyContent:'start', paddingLeft:'20px',paddingRight:'20px', color:'#a9acb1'}}>{t('New message')}</h2>
                                            <div style={{ marginTop:'18px', borderBottom:'1px solid #cfd0d2', width:'100%', display:'flex',justifyContent:'start' }}></div>
                                        </div>
                                        {openChat?._id=="" &&newMessage && !newChatFlag   && (
                                        <div style={{display:'flex', width:'100%', marginTop:'40px', flexDirection:'column'}}>
                                            <SearchInput placeHolder={'Type a name'} value={searchContactName} ariaLabel={'Type a name'} onChange={setsearchContactName}/>
                                            <div style={{marginTop:'20px', paddingBottom:'20px', paddingLeft:'20px', paddingRight:'20px', borderRadius:'25px', border:'1px solid #cfd0d2', height:'100%'}}>
                                                <div style={{overflowY:'scroll'}}>
                                                {usersFollowedBy.length>0?usersFollowedBy.map((user:User, index)=>
                                                    <div  key={index}  >


                                                            {/*<div className={globalStyles.separate_line_grey} style={{marginBottom:'50px' ,width:'110%' }}></div>*/}
                                                            <div style={{cursor:'pointer'}} className={styles.messagesContainer__leftSide__messageBox} onClick={()=>openNewMessageChat(user)} >
                                                                <div  className={styles.closedChat} style={{paddingBottom:'30px', paddingTop:'30px' ,display:'flex',alignItems:'center', justifyContent:'space-between', width:'100%'  }}>
                                                                    <div style={{display:'flex', flexDirection:'row', alignItems:'start', gap:'10px', paddingLeft:'10px', paddingRight:'10px'}}>
                                                                        <ProfileImage name={user.name}/>
                                                                        <div style={{display:'flex', flexDirection:'column', gap:'10px', alignItems:'start'}}>
                                                                            <span style={{fontSize:'15px', color:'#404141'}} className={globalStyles.simpleP}>{user.name}</span>
                                                                            <span style={{fontSize:'13px', fontWeight:'normal', color:'#79797a'}} className={globalStyles.simpleP}>{user.about}</span>

                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div style={{  borderBottom:'1px solid #cfd0d2', width:'100%', display:'flex',justifyContent:'start' }}></div>
                                                            </div>
                                                    </div>
                                                ):null}
                                                </div>
                                            </div>

                                        </div>
                                        )}
                                        {openChat?._id=="" &&newMessage && newChatFlag && newUserToChat&&(
                                            <div style={{marginTop:'50px'}}>
                                            <div style={{ display:'flex', gap:'10px'}}>
                                                {/*write a new msg*/}
                                                <ProfileImage name={newUserToChat.name}/>
                                                <div style={{display:'flex', flexDirection:'column', gap:'10px', alignItems:'start'}}>
                                                    <span style={{fontSize:'15px', color:'#404141'}} className={globalStyles.simpleP}>{newUserToChat.name}</span>
                                                    <span style={{fontSize:'13px', fontWeight:'normal', color:'#79797a'}} className={globalStyles.simpleP}>{newUserToChat.about}</span>

                                                </div>

                                            </div>
                                            <div style={{width:'100%', marginTop:'40px'}}>
                                                <div style={{  paddingBottom:'5px', borderBottom:'1px solid #cfd0d2',marginBottom:'15px', width:'100%', display:'flex',justifyContent:'start' }}></div>
                                                <TextAreaComponent color={'grey'} onSendClick={sendNewMessageToNewChat} onChange={setnewMessageContentHandler} value={newMessageContent} textPlaceHolder={t('Write a message')}/>
                                            </div>
                                            </div>
                                    )}
                                    </div>
                                    ):null}
                                    {/*messages*/}
                                    <div style={{display:'flex', flexDirection:'column', width:'100%', maxHeight:'50vh', overflowY:'scroll'}}>
                                    {openChat && !newMessage ? openChat?.messages.map((msg:Message, index)=>
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
                                    </div>}
                                    </div>):null}




                                    </div>
                                    {/*send message*/}
                                    {openChat && !newMessage?(
                                        <div style={{width:'100%'}}>
                                            <div style={{  paddingBottom:'5px', borderBottom:'1px solid #cfd0d2',marginBottom:'15px', width:'100%', display:'flex',justifyContent:'start' }}></div>
                                            <TextAreaComponent color={'grey'} onSendClick={sendNewMessage} onChange={setnewMessageContentHandler} value={newMessageContent} textPlaceHolder={t('Write a message')}/>
                                        </div>
                                        ):null}
                                </div>

                            </div>

                            </div>


                    ):(
                        <div>
                            <span className={globalStyles.simpleP}>    {   t(  "There is no messages")}</span>

                        </div>
                    )}
                </div>

            </div>
        </>

    );
}
export default MessagesComponent
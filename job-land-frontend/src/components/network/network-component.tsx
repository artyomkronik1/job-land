import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import React, { useContext, useEffect, useState } from "react";
import styles from './network.module.scss'
import { useNavigate } from "react-router";
import { User } from "../../interfaces/user";
import { Post } from "../../interfaces/post";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import { toast } from "react-toastify";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import globals from "../../assets/global-styles/styles.module.scss";
import { Chat } from "../../interfaces/chat";
const NetworkComponent = observer(() => {
    const [connections, setConnections] = useState<User[]>(UserStore.users.filter((user: User) => UserStore.user.follow.includes(user.id)))
    // users that this user not follow yet
    const [users, setUsers] = useState<User[]>(UserStore.users.filter((user: User) => !UserStore.user.follow.includes(user.id) && user.id != UserStore.user.id))
    const navigate = useNavigate();
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };



    useEffect(() => {

        if (UserStore.searchValue.length > 0) {
            let filteredUsers: User[] = []
            let filteredConnections: User[] = []

            connections.forEach((c: User) => {
                if (c.name == UserStore.searchValue || c.about == UserStore.searchValue) {
                    filteredUsers.push(c)
                }

            })


            users.forEach((c: User) => {
                if (c.name == UserStore.searchValue || c.about == UserStore.searchValue) {
                    filteredConnections.push(c)
                }

            })
            if (filteredUsers.length > 0) {
                setConnections(filteredUsers)
            }

            else {
                setConnections(UserStore.users.filter((user: User) => UserStore.user.follow.includes(user.id)))
            }

            if (filteredConnections.length > 0) {
                setUsers(filteredConnections)
            }
            else {
                setUsers(UserStore.users.filter((user: User) => !UserStore.user.follow.includes(user.id) && user.id != UserStore.user.id))

            }


        }
        else {
            setUsers(UserStore.users.filter((user: User) => !UserStore.user.follow.includes(user.id) && user.id != UserStore.user.id))

            setConnections(UserStore.users.filter((user: User) => UserStore.user.follow.includes(user.id)))

        }
    }, [UserStore.searchValue]);




    const makeFollow = async (event: any, userId: string, userIdToFollow: string) => {
        event.stopPropagation();
        const res = await UserStore.makeFollow(userId, userIdToFollow);
        if (res.success) {
            UserStore.setLoading(true);
            setTimeout(() => {
                toast.success(t('SUCCESS'));
                UserStore.setLoading(false);
            }, 1000);
        }
        else {
            toast.success(t('ERROR'));
        }
    }
    const goToUserProfile = (userid: string) => {
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            navigate(`/profile/${userid}`);
            UserStore.setTab("Profile")
        }, 1000)
    }
    const MessageToUser = (event: any, id: string) => {
        event.stopPropagation();
        const c = UserStore.chats.find((chat: Chat) => chat.messages[0].receiver == id || chat.messages[0].sender == id)
        if (c) {
            UserStore.setCurrentChat(c as Chat)
        }
        else {
            UserStore.setnewUserToChat(id)

        }
        console.log(c);

    }
    const [useSearchValue, setSearchValue] = useState('');
    return (
        <>
            <ToastComponent />
            <div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
                <div style={{ marginTop: '90px', display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%', flexWrap: 'wrap' }} >
                    {/*    network*/}
                    {connections && connections.length > 0 && (
                        <p className={globals.h2}> {t('Your connections')} </p>
                    )}

                    <div style={{ display: "flex", flexDirection: 'row', gap: '20px', flexWrap: 'wrap', width: '100%' }}>
                        {connections && connections.length > 0 && connections.map((user: User, index: number) => (
                            <div className={styles.jobContainer} key={index} onClick={() => goToUserProfile(user.id)}>
                                <div className={styles.jobContainer__header}> <ProfileImage user={user} /> </div>
                                <div className={styles.jobContainer__body}>
                                    <span style={{ fontSize: '22px', color: '#1c1c39' }}> {user.name}</span>
                                    <span style={{ color: '#717273', fontSize: '19px', fontWeight: 'normal', wordBreak: 'break-word', overflow: 'hidden', maxHeight: '30px', maxWidth: '200px' }} className={globalStyles.simpleP}> {user.about ? user.about : 'No about'}</span>
                                    <button onClick={(event) => MessageToUser(event, user.id)} style={{ width: '15vh', display: 'flex', gap: '8px', height: '35px', alignItems: 'center', fontSize: '18px' }} className={globalStyles.btn_border}>
                                        <i style={{ fontSize: '17px' }} className="fa-regular fa-message" aria-hidden="true"></i>
                                        <span style={{ fontSize: '16px' }}> {t('Message')}</span>
                                    </button>
                                </div>
                            </div>))}
                    </div>

                    <div className={globals.separate_line_grey} style={{ marginBottom: '20px', marginTop: '40px' }}></div>
                    <p className={globals.h2}> {t('Make new connections')} </p>
                    <div style={{ display: "flex", flexDirection: 'row', gap: '20px', flexWrap: 'wrap', maxHeight: '100vh' }}>
                        {users.map((user: User, index) => (
                            <div className={styles.jobContainer} key={index} onClick={() => goToUserProfile(user.id)}>
                                <div className={styles.jobContainer__header} > <ProfileImage user={user} /> </div>
                                <div className={styles.jobContainer__body}>
                                    <span style={{ fontSize: '22px', color: '#1c1c39' }}> {user.name}</span>
                                    <span style={{ color: '#717273', fontSize: '19px', fontWeight: 'normal', wordBreak: 'break-word', overflow: 'hidden', maxHeight: '30px', maxWidth: '200px' }} className={globalStyles.simpleP}> {user.about ? user.about : 'No about'}</span>
                                    <button onClick={(event) => makeFollow(event, UserStore.user.id, user.id)} style={{ width: '15vh', display: 'flex', gap: '8px', height: '35px', alignItems: 'center', fontSize: '18px' }} className={globalStyles.btn_border}>
                                        <i style={{ fontSize: '17px' }} className="fa fa-user-plus" aria-hidden="true"></i>
                                        <span style={{ fontSize: '17px' }}> {t('Follow')}</span>
                                    </button>
                                </div>
                            </div>))}
                    </div>
                </div>
            </div>
        </>

    );
})
export default NetworkComponent
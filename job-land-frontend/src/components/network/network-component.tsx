import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import styles from './network.module.scss'
import {useNavigate} from "react-router";
import {User} from "../../interfaces/user";
import {Post} from "../../interfaces/post";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import {toast} from "react-toastify";

const  NetworkComponent  = observer( ()=>{
    // users that this user not follow yet
    const [users, setUsers] = useState<User[]>(        UserStore.users.filter((user:User)=> !UserStore.user.follow.includes(user.id) && user.id!=UserStore.user.id))
    const navigate = useNavigate();
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    const makeFollow = async(userId:string,userIdToFollow:string)=>{
        const res = await UserStore.makeFollow(userId, userIdToFollow);
        if(res.success)
        {
            UserStore.setLoading(true);
            setTimeout(() => {
                toast.success(t('SUCCESS'));
                UserStore.setLoading(false);
            }, 1000);
        }
        else{
            toast.success(t('ERROR'));
        }
    }

    const [useSearchValue, setSearchValue] = useState('');
    return (
        <>
                <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                    <div style={{marginTop:'90px',display:'flex', flexDirection:'column', alignItems:'start', width:'100%', flexWrap:'wrap'}} >
                    {/*    network*/}
                        <div style={{display:"flex",flexDirection:'column', gap:'20px', flexWrap:'wrap', height:'100vh'}}>
                        {users.map((user:User, index)=>(
                        <div className={styles.jobContainer} key={index}>
                            <div className={styles.jobContainer__header}> <ProfileImage name={user.name}/> </div>
                            <div className={styles.jobContainer__body}>
                                <span style={{fontSize:'22px', color:'#1c1c39'}}> {user.name}</span>
                                <span style={{color:'#717273',fontSize:'19px', fontWeight:'normal'}} className={globalStyles.simpleP}> {user.about}</span>
                           <button onClick={()=>makeFollow(UserStore.user.id, user.id)} style={{width:'15vh', display:'flex', gap:'8px', height:'35px', alignItems:'center', fontSize:'18px'}} className={globalStyles.btn_border}>
                               <i style={{fontSize:'17px'}} className="fa fa-user-plus" aria-hidden="true"></i>
                              <span style={{fontSize:'17px'}}> {t('Follow')}</span>
                           </button>
                            </div>
                        </div>))}
                    </div>
                    </div>
                </div>
        </>

    );
} )
export default NetworkComponent
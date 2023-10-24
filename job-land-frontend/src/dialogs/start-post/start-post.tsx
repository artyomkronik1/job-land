import React, {ReactNode, useEffect, useRef, useState} from 'react';
import UserStore from "../../store/user";
import styles from './start-post.module.scss'
import globalStyles from '../../assets/global-styles/styles.module.scss'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import Popup from "../../base-components/popup/popup-component";
import {log} from "util";
import popupStyles from '../../base-components/popup/popup.module.scss'
import WarningPopup from "../../base-components/warning-popyp/warning-popup";
export interface startPostProps{
    isOpen:boolean;
    onClose:()=>void;
    children?:ReactNode;
}
const StartPostDialog = (props:startPostProps) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                closeDialog();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const [showWarningPopup, setshowWarningPopup] = useState(false)
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [description, setDescription] = useState('')
    const post=async()=>{
     const res = await UserStore.post('title',UserStore.user.id, description)
        if (res?.success) {
            UserStore.setLoading(true);
            toast.success('SUCCESS');
            setTimeout(() => {
                UserStore.setLoading(false);
            }, 3000);
        } else {
            toast.error('ERROR!' + ' ' + res?.errorCode);
        }
    }
    const closeDialog=()=>{
        console.log('description',description)
        if(description.length==0) {
            closeFinalyDialog()
        }
        else{
            setshowWarningPopup(true)
        }
    }
    const closeFinalyDialog=()=>{
        props.onClose()
    }
    const handleChange = (event:React.ChangeEvent<HTMLTextAreaElement>)=>{
            setDescription(event.target.value);
    }

    return (
<>
            <Popup onClose={closeDialog}>
                {description}
                    <div className={styles.main}>
                        <div className={styles.main__header}>
                            <ProfileImage name={UserStore.user.name}/>
                            <span style={{fontSize:'20px'}} className={globalStyles.mainGreySpan}>{UserStore.user.name}</span>
                        </div>
                        <div className={styles.main__header__body}>
                            <textarea placeholder={t('What do you want to talk about?')} style={{outline:'none', width:'100%', backgroundColor:'white', borderRadius:'30px', border:'none', paddingLeft:'20px', color:'#79797a',  fontSize:'25px', height:'100%'}} onChange={handleChange}></textarea>
                        </div>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <div className={globalStyles.separate_line_grey}></div>
                        </div>
                        <div style={{display:'flex', justifyContent:'end', flex:'1 1 auto'}}>
                            <button style={{width:'80px'}} onClick={post} className={globalStyles.btn}>{t('Post')}</button>
                        </div>
                    </div>
                </Popup>
            <WarningPopup isOpen={showWarningPopup} onClose={closeFinalyDialog} onConfirm={closeFinalyDialog} onCancel={()=>setshowWarningPopup(false)}/>
</>
    );
};

export default StartPostDialog;
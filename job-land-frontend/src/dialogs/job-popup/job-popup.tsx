import React, {ReactNode, useEffect, useRef, useState} from 'react';
import UserStore from "../../store/user";
import styles from './job-popup.module.scss'
import globalStyles from '../../assets/global-styles/styles.module.scss'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import Popup from "../../base-components/popup/popup-component";
import WarningPopup from "../../base-components/warning-popyp/warning-popup";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import jobsStore from "../../store/job";
import {Job} from "../../interfaces/job";
export interface jobPopupProps{
    isOpen:boolean;
    onClose:(success:boolean)=>void;
    children:Job ;
}
const JobPopup = (props:jobPopupProps) => {
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
    const closeDialog=()=>{
        if(description.length==0) {
            closeFinalyDialog(false)
        }
        else{
            setshowWarningPopup(true)
        }
    }
    const closeFinalyDialog=(success:boolean)=>{
        props.onClose(success)
    }
    const handleChange = (event:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setDescription(event.target.value);
    }

    return (
        <>

            <Popup onClose={closeDialog}>
        <ToastComponent />
        <div className={styles.main}>
        <div className={styles.main__header}>
    <div style={{display:'flex', flexDirection:'column', alignItems:'start'}}>
    <span style={{fontSize:'20px'}} className={globalStyles.mainGreySpan}>{props.children.title}</span>
        <span style={{fontSize:'18px', fontWeight:'normal', color:'#79797a'}} className={globalStyles.mainGreySpan}>{props.children.description}</span>
        </div>
        </div>
        <div className={styles.main__header__body}>
        </div>
        <div style={{display:'flex', justifyContent:'center'}}>
    <div className={globalStyles.separate_line_grey}></div>
        </div>
        <div style={{display:'flex', justifyContent:'end', flex:'1 1 auto'}}>
    <button style={{width:'80px'}}  className={globalStyles.btn}>{t('Post')}</button>
    </div>
    </div>
    </Popup>
    {/*<WarningPopup isOpen={showWarningPopup} onClose={closeFinalyDialog} onConfirm={closeFinalyDialog} onCancel={()=>setshowWarningPopup(false)}/>*/}
    </>
);
};

export default JobPopup;
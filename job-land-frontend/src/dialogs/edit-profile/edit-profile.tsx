import React, {ReactNode, useEffect, useRef, useState} from 'react';
import UserStore from "../../store/user";
import styles from './edit-profile.module.scss'
import globalStyles from '../../assets/global-styles/styles.module.scss'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import Popup from "../../base-components/popup/popup-component";
import WarningPopup from "../../base-components/warning-popyp/warning-popup";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import jobsStore from "../../store/job";
import {User} from "../../interfaces/user";
import TextInputField from "../../base-components/text-input/text-input-field";
export interface editProfileProps{
    isOpen:boolean;
    onClose:(success:boolean)=>void;
    children:User;
}
const EditProfileDialog = (props:editProfileProps) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // click outside of popup closing the popup
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node) &&name.length>0 && about.length>0) {
                closeDialog();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [name, setname] = useState(props.children.name)
    const [about, setabout] = useState(props.children.about)
    const saveSettings=async()=> {
        // check if there is not empty
        if (name.length == 0 || about.length == 0) {
            setTimeout(() => {
                toast.error(t('ERROR ' + 'NAME OR ABOUT IS EMPTY'));
            }, 1000)
        } else {
            // creating the new user obj by its values and updated name and about
            let user: User = props.children;
            user.name = name;
            user.about = about
            // set info
           const res =  await UserStore.setUserInfo(user)
            console.log(res)
            if(res.data.success) {
                toast.success(t('SUCCESS'));
                setTimeout(() => {
                    closeFinalyDialog(true)
                }, 1000)
            }
            else if(!res.data.success)
            {
                toast.error(t('ERROR' + res.data.errorCode));

            }
            // close dialog
        }
    }
    // close dialog
    const closeDialog=()=>{
            closeFinalyDialog(true)
    }
    const closeFinalyDialog=(success:boolean)=>{
        props.onClose(success)
    }
    const handleChangeName = (event:any)=>{
        setname(event.target.value);
    }
    const handleChangeAbout = (event:any)=>{
        setabout(event.target.value);
    }

    return (
        <>

            <Popup onClose={closeDialog}>
                <ToastComponent />
                <div className={styles.main}>
                    <div className={styles.main__header}>
                        <ProfileImage name={props.children.name}/>
                        <div style={{marginTop:'10px', display:'flex', flexDirection:'column'}}>
                        {/*name*/}
                        <div style={{display:'flex', flexDirection:'column', alignItems:'start'}}>
                            <TextInputField type={'text'} placeHolder={t('Enter Your Full Name')} text={t('Full Name')} value={name} onChange={handleChangeName}/>
                        </div>
                        {/*about*/}
                        <div style={{display:'flex', flexDirection:'column', alignItems:'start'}}>
                            <TextInputField type={'text'} placeHolder={t('Enter About Yourself')} text={t('About')} value={about} onChange={handleChangeAbout}/>
                        </div>
                        </div>
                    </div>
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <div className={globalStyles.separate_line_grey}></div>
                    </div>
                    <div style={{display:'flex', justifyContent:'end', flex:'1 1 auto'}}>
                        <button style={{width:'80px'}} onClick={saveSettings}  className={globalStyles.btn}>{t('Save')}</button>
                    </div>
                </div>
            </Popup>
            {/*<WarningPopup warningText={"Name is empty"} isOpen={showWarningPopup} onClose={()=>closeFinalyDialog} onConfirm={()=>setshowWarningPopup(false)} onCancel={()=>setshowWarningPopup(false)}/>*/}
        </>
    );
};

export default EditProfileDialog;
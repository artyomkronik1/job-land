import React, {ReactNode, useEffect, useRef, useState} from 'react';
import UserStore from "../../store/user";
import styles from './start-post.module.scss'
import globalStyles from '../../assets/global-styles/styles.module.scss'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import Popup from "../../base-components/popup/popup-component";
import WarningPopup from "../../base-components/warning-popyp/warning-popup";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import jobsStore from "../../store/job";
import TextInputField from "../../base-components/text-input/text-input-field";
export interface postProps{
    isOpen:boolean;
    onClose:(success:boolean)=>void;
    children?:ReactNode;
}
const StartPostDialog = (props:postProps) => {
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
    const [title, setTitle] = useState('')

    const post=async()=>{
        // check if description is empty
        if(description==''){
            toast.error(t('ERROR! Description is empty') );
        }
        else{
            const res = await UserStore.post(title, UserStore.user.id, description, UserStore.user.name)
            if (res?.success) {
                toast.success(t('SUCCESS'));
                // updating the posts with new post
                await jobsStore.getAllPosts()
            } else {
                toast.error(t('ERROR!') + ' ' + res?.errorCode);
            }
            closeFinalyDialog(true)
        }

    }
    const closeDialog=()=> {
        setshowWarningPopup(true)
    }
    const closeFinalyDialog=(success:boolean)=>{
        props.onClose(success)
    }
    const handleChange = (event:React.ChangeEvent<HTMLTextAreaElement>)=>{
            setDescription(event.target.value);
    }
   const handleChangeTitle=(title:string)=>{
        setTitle(title)
   }

    return (
<>

            <Popup onClose={closeDialog}>
                <ToastComponent />
                    <div className={styles.main}>
                        <div className={styles.main__header} style={{marginBottom:'30px'}}>
                            <ProfileImage name={UserStore.user.name}/>
                            <div style={{display:'flex', flexDirection:'column', alignItems:'start'}}>
                            <span style={{fontSize:'20px'}} className={globalStyles.mainGreySpan}>{UserStore.user.name}</span>
                            <span style={{fontSize:'18px', fontWeight:'normal', color:'#79797a'}} className={globalStyles.mainGreySpan}>{UserStore.user.about}</span>
                            </div>
                        </div>

                        {/*<TextInputField type={'text'}  placeHolder={'job zone'} text={'Post Title'} value={title} onChange={handleChangeTitle}/>*/}

                        <div className={styles.main__header__body} style={{marginTop:'0px'}}>
                            <textarea  placeholder={t('What do you want to talk about?')} style={{outline:'none', resize:"none", width:'100%', backgroundColor:'white', borderRadius:'30px', border:'none', paddingLeft:'20px', color:'#79797a',  fontSize:'25px', height:'100%'}} onChange={handleChange}></textarea>
                        </div>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <div className={globalStyles.separate_line_grey}></div>
                        </div>
                        <div style={{display:'flex', justifyContent:'end', flex:'1 1 auto'}}>
                            <button style={{width:'80px'}} onClick={post} className={globalStyles.btn}>{t('Post')}</button>
                        </div>
                    </div>
                </Popup>
            <WarningPopup isOpen={showWarningPopup} onClose={()=>closeFinalyDialog} onConfirm={()=>props.onClose(true)} onCancel={()=>setshowWarningPopup(false)} warningText={t('Are you sure?')}/>
</>
    );
};

export default StartPostDialog;
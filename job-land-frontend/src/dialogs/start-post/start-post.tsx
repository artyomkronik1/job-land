import React, { ReactNode, useEffect, useRef, useState } from 'react';
import UserStore from "../../store/user";
import styles from './start-post.module.scss'
import globalStyles from '../../assets/global-styles/styles.module.scss'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Popup from "../../base-components/popup/popup-component";
import WarningPopup from "../../base-components/warning-popyp/warning-popup";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import jobsStore from "../../store/job";
import uploadImg from '../../assets/images/uploadImg.png'
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import DateService from '../../services/dateService';
export interface postProps {
    isOpen: boolean;
    onClose: (success: boolean) => void;
    children?: ReactNode;
}

const StartPostDialog = (props: postProps) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [updatedPicture, setupdatedPicture] = useState('');




    const [showWarningPopup, setshowWarningPopup] = useState(false);

    // Language
    const { t } = useTranslation();
    const { i18n } = useTranslation();

    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
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
    }, [description]);

    const post = async () => {
        // Check if description is empty
        if (description === '') {
            toast.error(t('ERROR! Description is empty'));
        } else {
            const res = await UserStore.post(title, UserStore.user.id, description, UserStore.user.name, updatedPicture);
            if (res?.success) {
                const followers = UserStore.users.filter(user => user.follow.includes(UserStore.user.id));
                followers.forEach(async follower => {
                    let notification = {
                        message: t("just posted a new post"),
                        to: follower.id,
                        time: DateService.getCurrentDatetime(),
                        link: res.post.id,
                        from: UserStore.user.name,
                        type: 'new_post'
                    };

                    await UserStore.makeNotifications(notification);
                })

                UserStore.setLoading(true);
                setTimeout(async () => {
                    UserStore.setLoading(false);

                    toast.success(t('SUCCESS'));
                }, 1000)

            } else {
                toast.error(t('ERROR!') + ' ' + res?.errorCode);
            }
            closeFinalyDialog(true);
        }
    };

    const closeDialog = () => {
        if (description.length > 0) {
            setshowWarningPopup(true);
        } else {
            closeFinalyDialog(true);
        }
    };

    const closeFinalyDialog = (success: boolean) => {
        props.onClose(hasChanges);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
        setHasChanges(true); // Set changes flag when description changes
    };


    const handleBackgroundPicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const storageRef = firebase.storage().ref()
            const fileRef = storageRef.child(file.name)
            fileRef.put(file).then((snapchot) => {
                snapchot.ref.getDownloadURL()
                    .then((downloadURL) => {
                        console.log(downloadURL)
                        uploadPic(downloadURL);
                        //setImgUrl
                    })
            })


        }
    };

    const triggerFileInput = () => {
        const fileInput = document.getElementById("picInput");
        if (fileInput) {
            fileInput.click();
            //uploadPic(fileInput)
        }
    };
    const uploadPic = async (downloadURL: string) => {
        setupdatedPicture(downloadURL)

    };

    return (
        <>
            <Popup popupTitle='New post' width='90vh' onClose={() => props.onClose(true)}>
                <ToastComponent />
                <div ref={dialogRef} className={styles.main}>
                    <div className={styles.main__header} style={{ marginBottom: '30px' }}>
                        <ProfileImage user={UserStore.user} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                            <span style={{ fontSize: '20px' }} className={globalStyles.mainGreySpan}>{UserStore.user.name}</span>
                            <span style={{ fontSize: '18px', fontWeight: 'normal', color: '#79797a', overflow: 'hidden', maxWidth: '100%' }} className={globalStyles.mainGreySpan}>{UserStore.user.about}</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '50px' }}>
                        {updatedPicture.length > 0 && (
                            <label htmlFor="picInput">
                                <img
                                    src={updatedPicture}
                                    style={{ width: '100%', cursor: "pointer", display: 'flex', height: '100%' }}
                                />
                            </label>
                        )}
                        <input
                            type="file"
                            id="picInput"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleBackgroundPicChange}
                        />
                    </div>

                    <div className={styles.main__header__body} style={{ marginTop: '0px' }}>
                        <textarea placeholder={t('What do you want to talk about?')} style={{ outline: 'none', resize: "none", width: '100%', backgroundColor: 'white', borderRadius: '30px', border: 'none', paddingLeft: '20px', color: '#79797a', fontSize: '25px', height: '100%' }} onChange={handleChange}></textarea>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={globalStyles.separate_line_grey}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div style={{ display: 'flex', cursor: 'pointer' }} onClick={triggerFileInput}>
                            <img className={globalStyles.editImg} src={uploadImg} style={{ width: '40px', height: '40px', display: 'flex' }} />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <button style={{ width: '80px' }} onClick={post} className={globalStyles.btn}>{t('Post')}</button>
                        </div>

                    </div>
                </div>
                <ToastComponent />
            </Popup>
            <WarningPopup isOpen={showWarningPopup && description.length > 0} onClose={() => setshowWarningPopup(false)} onConfirm={() => props.onClose(false)} onCancel={() => setshowWarningPopup(false)} warningText={t('Are you sure?')} />

        </>
    );
};

export default StartPostDialog;

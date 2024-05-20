import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './job-popup.module.scss';
import globalStyles from '../../assets/global-styles/styles.module.scss';
import ProfileImage from '../../base-components/profile-image/profile-image-component';
import { useTranslation } from 'react-i18next';
import Popup from '../../base-components/popup/popup-component';
import ToastComponent from '../../base-components/toaster/ToastComponent';
import { Job } from '../../interfaces/job';
import addcv from '../../assets/images/addcv.png';
import componentStyles from '../../components/MainLayout/mainLayout.module.scss';
import emailjs from '@emailjs/browser';
import userStore from "../../store/user";

export interface jobPopupProps {
    isOpen: boolean;
    onClose: (success: boolean) => void;
    children: Job;
}

const JobPopup = (props: jobPopupProps) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>(''); // State to store the uploaded file name
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref to the file input element

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                props.onClose(true);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const { t } = useTranslation();


    // file

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name); // Set the filename when a file is selected
        }
    };

    const handleUpload = async() => {
        if (file) {
            const formData = new FormData();
            formData.append('cv', file);
            const serviceID = "service_ktqrx6g";
            const templateID = "template_popyu06";

            const params = { from_name:"Job Land", email:userStore.getUserInfoById(props.children.hire_manager_id)?.email,to_name:props.children.hire_name, message:"Hi, new cv !"}
            try {
                const res = await emailjs.send(serviceID, templateID, params,{
                    publicKey: 'uBgCORDaioscnVWOQ'}
                );
                alert('Your CV sent successfully!!');
                props.onClose(true)
            } catch (err) {
                console.log(err);
            }

        }
    };

    const openFileManager = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <Popup onClose={() => props.onClose(true)}>
                <ToastComponent />
                <div className={styles.main}>
                    <div className={styles.main__header}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                            <ProfileImage name={props.children.hire_name} />
                            <div className={componentStyles.postContainer__header__details}>
                                <span style={{ fontSize: '20px', color: '#1c1c39' }}>{props.children.hire_name}</span>
                                <span style={{ color: '#717273', fontSize: '16px', fontWeight: 'normal' }} className={globalStyles.simpleP}>
                                  {props.children.company_name}
                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                  <span style={{ fontSize: '20px' }} className={globalStyles.mainGreySpan}>
                                    {props.children.title}
                                  </span>
                            <span
                                style={{
                                    marginTop:'20px',

                                    display: 'flex',
                                    color: '#717273',
                                    fontSize: '16px',
                                    fontWeight: 'normal',
                                    wordBreak: 'break-all',
                                    width: '100%',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    overflow: 'hidden',
                                }}
                            >
                {props.children.description}
              </span>
                        </div>
                        {/* Add CV */}
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '30px', gap: '10px' }}>
                            <label htmlFor="cv-upload" onClick={openFileManager} style={{display:"flex", gap:'10px',cursor:'pointer'}}>

                            <span className={globalStyles.mainGreySpan} style={{ fontSize: '22px' }}>
                                {fileName ? fileName : t('add cv')} {/* Display filename if available, otherwise show "Add CV" */}
                              </span>
                            <div>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    ref={fileInputRef} // Assign the ref to the file input element
                                />
                                    <img
                                        style={{ cursor: 'pointer' }}
                                        width={30}
                                        height={30}
                                        src={addcv}
                                        alt="Upload CV"
                                    />
                            </div>
                            </label>

                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={globalStyles.separate_line_grey}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'end', flex: '1 1 auto' }}>
                        <button style={{ width: '80px' }} className={globalStyles.btn} onClick={handleUpload}>
                            {t('Apply')}
                        </button>
                    </div>
                </div>
            </Popup>
        </>
    );
};

export default JobPopup;

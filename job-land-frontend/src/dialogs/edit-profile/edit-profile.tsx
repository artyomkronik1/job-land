import React, { ReactNode, useEffect, useRef, useState } from 'react';
import UserStore from "../../store/user";
import styles from './edit-profile.module.scss'
import styless from '../postNewJob/post-new-job.module.scss';

import globalStyles from '../../assets/global-styles/styles.module.scss'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Popup from "../../base-components/popup/popup-component";
import WarningPopup from "../../base-components/warning-popyp/warning-popup";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import jobsStore from "../../store/job";
import { User } from "../../interfaces/user";
import TextInputField from "../../base-components/text-input/text-input-field";
import { Post } from "../../interfaces/post";
import userService from "../../services/userService";
import AutoCompleteComponent from '../../base-components/autocomplete-component/autocomplete-component';
export interface editProfileProps {
    isOpen: boolean;
    profileForEdit: User;
    onClose: (success: boolean) => void;
}
const EditProfileDialog = (props: editProfileProps) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [profileInEdit, setprofileInEdit] = useState<User>(props.profileForEdit);
    const [showWarningPopup, setshowWarningPopup] = useState(false)
    const [hasChanges, setHasChanges] = useState(false);



    const companiesoptions = jobsStore.companies.map(company => company.name);


    const saveSettings = async () => {
        // check if there is not empty
        if (profileInEdit.name.length == 0 || profileInEdit.about.length == 0) {
            setTimeout(() => {
                toast.error(t('ERROR ' + 'NAME OR ABOUT IS EMPTY'));
            }, 1000)

        }

        else if (profileInEdit.name.length > 15 || profileInEdit.about.length > 15 || profileInEdit.experience.length > 15 || profileInEdit.education.length > 15) {
            setTimeout(() => {
                toast.error(t('ERROR ' + 'ONE OF FIELDS IS TOO LONG, NO MORE THAN 15 CHARACTERS'));
            }, 1000)
        }
        else {
            // set info
            const res = await userService.setUserInfo(profileInEdit)
            if (res.data.success) {
                // set current user
                UserStore.setUser(profileInEdit)
                UserStore.users.forEach((u) => {
                    if (u.id == profileInEdit.id) {
                        u.name = profileInEdit.name;
                        u.about = profileInEdit.about;
                        u.experience = profileInEdit.experience;
                        u.education = profileInEdit.education;
                        u.companyName = profileInEdit.companyName;


                    }
                })
                toast.success(t('SUCCESS'));
                setTimeout(() => {
                    closeFinalDialog()
                }, 1000)
            }
            else if (!res.data.success) {
                toast.error(t('ERROR' + res.data.errorCode));

            }
            // close dialog
        }
    }
    // close dialog
    const closeDialog = () => {
        // Check if there are changes
        if (hasChanges) {
            setshowWarningPopup(true);
        } else {
            closeFinalDialog();
        }
    }
    const closeFinalDialog = () => {
        props.onClose(hasChanges);
    };
    const handleChangeName = (event: any) => {
        setprofileInEdit({
            ...profileInEdit,
            name: event,
        });
        setHasChanges(true); // Set changes flag when name changes
    };

    const handleChangeAbout = (event: any) => {
        setprofileInEdit({
            ...profileInEdit,
            about: event,
        });
        setHasChanges(true); // Set changes flag when about changes
    };

    const handleChangeExperience = (event: any) => {
        setprofileInEdit({
            ...profileInEdit,
            experience: event,
        });
        setHasChanges(true); // Set changes flag when about changes
    };


    const handleChangeCompany = (event: any) => {
        console.log('event', event);

        setprofileInEdit({
            ...profileInEdit,
            companyName: event,
        });
        setHasChanges(true); // Set changes flag when about changes
    };

    const handleChangeEduacation = (event: any) => {
        setprofileInEdit({
            ...profileInEdit,
            education: event,
        });
        setHasChanges(true); // Set changes flag when about changes
    };

    const handleTypeUserChange = (event: any) => {
        setprofileInEdit({
            ...profileInEdit,
            role: event,
        });
        setHasChanges(true); // Set changes flag when about changes
    };


    // listening when user click outside of popup so close it
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
    }, [hasChanges]);
    return (
        <>

            <Popup popupTitle='Profile details' width='100vh'>
                <ToastComponent />
                <div ref={dialogRef} className={styles.main}>
                    <div className={styles.main__header}>
                        {/* <ProfileImage name={profileInEdit.name}/> */}
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '40px', width: '95%' }}>
                            {/*name*/}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                <TextInputField size={'small'} type={'text'} placeHolder={t('Enter Your Full Name')} text={t('Full Name')} value={profileInEdit.name} onChange={handleChangeName} />
                            </div>
                            {/*about*/}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                <TextInputField size={'small'} type={'text'} placeHolder={t('Enter About Yourself')} text={t('About')} value={profileInEdit.about} onChange={handleChangeAbout} />
                            </div>
                            {/*company*/}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                <AutoCompleteComponent
                                    type="text"
                                    size={'small'}
                                    text={t('Company name')}
                                    placeHolder="Search company..."
                                    value={profileInEdit.companyName}
                                    onChange={handleChangeCompany}
                                    options={companiesoptions}

                                />
                            </div>

                            {/*exoerience*/}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                <TextInputField size={'small'} type={'text'} placeHolder={t('Enter About Your Experience')} text={t('Experience')} value={profileInEdit.experience} onChange={handleChangeExperience} />
                            </div>



                            {/*education*/}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                <TextInputField size={'small'} type={'text'} placeHolder={t('Enter About Your Education')} text={t('Education')} value={profileInEdit.education} onChange={handleChangeEduacation} />
                            </div>

                            {/*role*/}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '5px' }}>
                                <span style={{
                                    color: '#0a66c2',
                                    fontSize: '18px', fontWeight: 'bold'
                                }} >
                                    {t('Role')}
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', gap: '10px' }}>
                                    <div onClick={() => handleTypeUserChange('1')} className={profileInEdit.role == "1" ? styless.btnOption_checked : styless.btnOption}>{t('Search for a job')} </div>
                                    <div onClick={() => handleTypeUserChange('0')} className={profileInEdit.role == '0' ? styless.btnOption_checked : styless.btnOption}>{t('Hiring for a job')}</div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <div className={globalStyles.separate_line_grey}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'end', flex: '1 1 auto', marginTop: '20px' }}>
                        <button style={{ width: '80px' }} onClick={saveSettings} className={globalStyles.btn}>{t('Save')}</button>
                    </div>
                </div>
            </Popup>
            <WarningPopup
                isOpen={showWarningPopup}
                onClose={() => props.onClose(false)}
                onConfirm={saveSettings}
                onCancel={() => props.onClose(false)}
                warningText={t('Do you wanna save changes?')}
            />
        </>
    );
};

export default EditProfileDialog;
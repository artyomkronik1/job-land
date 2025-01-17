import React, { ReactNode, useEffect, useRef, useState } from 'react';
import UserStore from "../../store/user";
import styles from './edit-profile.module.scss'
import styless from '../postNewJob/post-new-job.module.scss';
import * as usageFunctions from "../../usage-functions/usage-functions";
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
import DropDown from "../../base-components/dropdown-component/dropdown";
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
    const experienceOptions :string[]= [
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "Full-Stack Developer",
        "Mobile App Developer",
        "Game Developer",
        "Cloud Engineer",
        "Data Scientist",
        "Data Analyst",
        "Data Engineer",
        "Machine Learning Engineer",
        "AI Research Scientist",
        "AI Ethics Specialist",
        "Natural Language Processing Engineer",
        "Robotics Engineer",
        "Computer Vision Engineer",
        "Deep Learning Engineer",
        "Cybersecurity Analyst",
        "Penetration Tester",
        "Cybersecurity Engineer",
        "Security Architect",
        "Cryptographer",
        "Chief Information Security Officer (CISO)",
        "Blockchain Developer",
        "Blockchain Architect",
        "Blockchain Consultant",
        "Smart Contract Developer",
        "Blockchain Security Specialist",
        "Quantum Computing Researcher",
        "Quantum Software Engineer",
        "3D Printing Engineer",
        "IoT (Internet of Things) Engineer",
        "Embedded Systems Engineer",
        "Hardware Engineer",
        "Electrical Engineer",
        "FPGA Developer",
        "Robotics Hardware Engineer",
        "UI/UX Designer",
        "Product Designer",
        "Interaction Designer",
        "UX Researcher",
        "Visual Designer",
        "Motion Graphics Designer",
        "Cloud Solutions Architect",
        "Cloud Administrator",
        "Cloud Operations Engineer",
        "Site Reliability Engineer (SRE)",
        "AI/ML Product Manager",
        "Technical Product Manager",
        "Project Manager (Tech)",
        "Agile Coach",
        "Scrum Master",
        "IT Support Engineer",
        "Network Engineer",
        "Network Architect",
        "Systems Administrator",
        "Database Administrator (DBA)",
        "IT Operations Manager",
        "Sales Engineer (Tech)",
        "Solutions Architect",
        "Pre-Sales Engineer",
        "Cloud Consultant",
        "DevOps Engineer",
        "Site Reliability Engineer (SRE)",
        "Business Intelligence Analyst",
        "Product Owner",
        "Cloud Security Architect",
        "Big Data Engineer",
        "AI Product Manager",
        "AI/ML Solutions Engineer",
        "Telecommunications Engineer",
        "5G Engineer",
        "Wireless Communications Engineer",
        "Digital Transformation Specialist",
        "AI Operations Manager",
        "Virtual Reality Developer",
        "Augmented Reality (AR) Developer",
        "XR (Extended Reality) Engineer",
        "Chatbot Developer",
        "Voice Interface Developer",
        "Autonomous Vehicle Engineer",
        "Space Technology Engineer",
        "Biotechnology Engineer",
        "Ethical Hacker",
        "Tech Support Specialist",
        "Digital Marketing Specialist (Tech)",
        "Marketing Automation Specialist",
        "Growth Hacker (Tech)",
        "Content Strategist (Tech)",
        "Data Privacy Officer",
        "Technology Policy Analyst",
        "AI Policy Expert",
        "Mobile Security Engineer",
        "DevSecOps Engineer",
        "Penetration Tester (Ethical Hacker)",
        "AI Test Engineer",
        "Cloud Security Engineer",
        "Cloud Data Engineer",
        "Performance Engineer",
        "Test Automation Engineer",
        "System Integration Engineer",
        "Product Analyst",
        "Test Engineer",
        "Agile Product Owner",
        "Cloud Infrastructure Engineer",
        "API Developer",
        "Voice Assistant Engineer",
        "AI Software Engineer",
        "Big Data Architect",
        "IoT Solutions Architect",
        "E-commerce Developer",
        "Business Systems Analyst",
        "Data Privacy Engineer",
        "Chief Technology Officer (CTO)",
        "Chief Data Officer (CDO)",
        "Technology Evangelist",
        "AI Software Developer",
        "AI Hardware Engineer",
        "Data Warehouse Engineer",
        "Mobile UX Designer",
        "Product Manager for AI",
        "Full Stack AI Developer",
        "Cloud Infrastructure Architect"
    ];

    const saveSettings = async () => {
        // check if there is not empty
        if (profileInEdit.name.length == 0 || profileInEdit.about.length == 0) {
            setTimeout(() => {
                toast.error(t('ERROR ' + 'NAME OR ABOUT IS EMPTY'));
            }, 1000)

        }

        else if (profileInEdit.name.length > 15 || profileInEdit.about.length > 15  || profileInEdit.education.length > 15) {
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
            usageFunctions.handleClickOutside(dialogRef, event, closeDialog);
        };
        document.addEventListener('mousedown', handleClickOutside);
    }, [hasChanges]);
    return (
        <>

            <Popup popupTitle='Profile details' width='100vh' onClose={() => props.onClose(true)}>
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
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                                <AutoCompleteComponent
                                    type="text"
                                    size={'small'}
                                    text={t('Experience')}
                                    placeHolder="Choose role..."
                                    value={profileInEdit.experience}
                                    onChange={handleChangeExperience}
                                    options={experienceOptions}

                                />
                            </div>


                            {/*education*/}
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
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
                onClose={() => props.onClose(true)}
                onConfirm={saveSettings}
                onCancel={() => props.onClose(false)}
                warningText={t('Do you wanna save changes?')}
            />
        </>
    );
};

export default EditProfileDialog;
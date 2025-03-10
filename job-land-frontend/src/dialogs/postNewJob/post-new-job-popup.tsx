import React, { ReactNode, useEffect, useRef, useState } from 'react';
import UserStore from "../../store/user";
import styles from './post-new-job.module.scss';
import globalStyles from '../../assets/global-styles/styles.module.scss'
import newJob from "../../assets/images/newjob.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Popup from "../../base-components/popup/popup-component";
import WarningPopup from "../../base-components/warning-popyp/warning-popup";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import jobsStore from "../../store/job";
import TextInputField from "../../base-components/text-input/text-input-field";
import logo from "../../assets/images/icon.jpg";
import jobService from "../../services/jobService";
import AutoCompleteComponent from '../../base-components/autocomplete-component/autocomplete-component';
export interface postNewJobPopup {
    isOpen: boolean;
    onClose: (success: boolean) => void;
    children?: ReactNode;
}
const PostNewJobPopup = (props: postNewJobPopup) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const [showWarningPopup, setshowWarningPopup] = useState(false)
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [salary, setSalary] = useState(0)
    const [companyName, setcompanyName] = useState('')
    const [zone, setzone] = useState('')
    const [proffesion, setproffesion] = useState('')
    const [region, setregion] = useState('')
    const [manner, setManner] = useState('')
    const [level, setLevel] = useState('')
    const [scope, setScope] = useState('')

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
    }, [description, title, salary, companyName, zone, proffesion, region, manner, level, scope]);

    const post = async () => {
        // check if description is empty
        if (description.length == 0 || title.length == 0) {
            toast.error(t('ERROR! Title or Description is empty'));
            //  closeFinalyDialog(false)
        }
        else if (!jobsStore.companies.find(c => c.name == companyName)) {
            toast.error(t('ERROR! Company is not exist'));

        }
        else {
            const res = await jobService.postNewJob({
                title: title,
                description: description,

                id: "",
                salary: salary,
                hire_name: UserStore.user.name,
                company_name: companyName,
                hire_manager_id: UserStore.user.id,
                zone: zone,
                profession: proffesion,
                region: region,
                manner: manner,
                experienced_level: level,
                scope: scope,
                applications: []

            })
            if (res?.success) {
                UserStore.setLoading(true);
                await jobsStore.getALlJobs();
                setTimeout(async () => {
                    UserStore.setLoading(false);

                    toast.success(t('SUCCESS'));
                }, 1000)
            } else {
                toast.error(t('ERROR!') + ' ' + res?.errorCode);
            }
            closeFinalyDialog(true)
        }

    }
    const closeDialog = () => {
        if (description.length > 0 || title.length > 0 || salary > 0 || companyName.length > 0 || zone.length > 0 || proffesion.length > 0 || region.length > 0 || manner.length > 0 || level.length > 0 || scope.length > 0) { setshowWarningPopup(true) }
        else {
            props.onClose(false)

        }

    }
    const closeFinalyDialog = (success: boolean) => {
        props.onClose(success)
    }


    // handle changes
    const handleChangeTitle = (value: string) => {
        setTitle(value);
    };
    const handleChangeDescription = (value: string) => {
        setDescription(value);
    };
    const handleChangeSalary = (value: string) => {
        setSalary(Number(value));
    };
    const handleChangeCompany = (value: string) => {
        setcompanyName(value);
    };
    const handleChangeZone = (value: string) => {
        setzone(value);
    };
    const handleChangeProffesion = (value: string) => {
        setproffesion(value);
    };
    const handleChangeRegion = (value: string) => {
        setregion(value);
    };

    const handleMannerChange = (value: string) => {
        setManner(value);
    };

    const handleLevelChange = (value: string) => {
        setLevel(value);
    };

    const handleScopeChange = (value: string) => {
        setScope(value);
    };
    const companiesoptions = jobsStore.companies.map(company => company.name);


    return (
        <>

            <Popup width='100vh' popupTitle='Job Information' onClose={closeDialog}>
                <ToastComponent />
                <div ref={dialogRef} className={styles.main} >



                    <div className={styles.main__header__body} style={{
                        marginTop: '0px', display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'start',
                        paddingLeft: '60px',
                        paddingRight: '60px', gap: '80px'
                    }} >

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '35%' }}>
                            <TextInputField type={'text'} size={'small'} placeHolder={'job title'} text={t('Job Title')} value={title} onChange={handleChangeTitle} />
                            <TextInputField type={'text'} size={'small'} placeHolder={'job zone'} text={t('Job Zone')} value={zone} onChange={handleChangeZone} />
                            <TextInputField type={'number'} size={'small'} placeHolder={'job salary'} text={t('Job Salary')} value={salary} onChange={handleChangeSalary} />
                            <TextInputField type={'text'} size={'small'} placeHolder={'job region'} text={t('Job Region')} value={region} onChange={handleChangeRegion} />

                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '35%' }}>
                            <TextInputField type={'text'} size={'small'} placeHolder={'job description'} text={t('Job Description')} value={description} onChange={handleChangeDescription} />
                            <TextInputField type={'text'} size={'small'} placeHolder={'job proffesion'} text={t('Job Proffesion')} value={proffesion} onChange={handleChangeProffesion} />
                            <AutoCompleteComponent
                                type="text"
                                size={'small'}
                                text={t('Company name')}
                                placeHolder="Search company..."
                                value={companyName}
                                onChange={handleChangeCompany}
                                options={companiesoptions}

                            />
                            <img src={newJob} style={{ display: 'flex', width: '120px', justifyContent: 'center' }} />

                        </div>



                    </div>
                    {/*grey line*/}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={globalStyles.separate_line_grey}></div>
                    </div>

                    <div style={{ marginBottom: '30px', paddingRight: '60px', paddingLeft: '60px', display: 'flex', gap: '20px', flexDirection: 'column', marginTop: '30px' }}>
                        <span style={{ alignSelf: 'start', color: '#0a66c2', fontSize: '18px', fontWeight: 'bold' }}> {t('Manner')}</span>
                        <div style={{ display: 'flex', justifyContent: 'start', gap: '20px' }}>
                            <div onClick={() => handleMannerChange('On Site')} className={manner == 'On Site' ? styles.btnOption_checked : styles.btnOption}>{t('On Site')} </div>
                            <div onClick={() => handleMannerChange('Hybrid')} className={manner == 'Hybrid' ? styles.btnOption_checked : styles.btnOption}>{t('Hybrid')}</div>
                            <div onClick={() => handleMannerChange('Remote')} className={manner == 'Remote' ? styles.btnOption_checked : styles.btnOption}>{t('Remote')}</div>
                        </div>
                    </div>


                    {/*grey line*/}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={globalStyles.separate_line_grey}></div>
                    </div>

                    <div style={{ marginBottom: '30px', paddingRight: '60px', paddingLeft: '60px', display: 'flex', gap: '20px', flexDirection: 'column', marginTop: '30px' }}>
                        <span style={{ alignSelf: 'start', color: '#0a66c2', fontSize: '18px', fontWeight: 'bold' }}> {t('Experienced level')}</span>
                        <div style={{ display: 'flex', justifyContent: 'start', gap: '20px' }}>
                            <div onClick={() => handleLevelChange('Junior')} className={level == 'Junior' ? styles.btnOption_checked : styles.btnOption}>{t('Junior')} </div>
                            <div onClick={() => handleLevelChange('Mid-level')} className={level == 'Mid-level' ? styles.btnOption_checked : styles.btnOption}>{t('Mid-level')}</div>
                            <div onClick={() => handleLevelChange('Senior')} className={level == 'Senior' ? styles.btnOption_checked : styles.btnOption}>{t('Senior')}</div>
                        </div>
                    </div>

                    {/*grey line*/}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={globalStyles.separate_line_grey}></div>
                    </div>

                    <div style={{ marginBottom: '30px', paddingRight: '60px', paddingLeft: '60px', display: 'flex', gap: '20px', flexDirection: 'column', marginTop: '30px' }}>
                        <span style={{ alignSelf: 'start', color: '#0a66c2', fontSize: '18px', fontWeight: 'bold' }}> {t('Scope')}</span>
                        <div style={{ display: 'flex', justifyContent: 'start', gap: '20px' }}>
                            <div onClick={() => handleScopeChange('Part time')} className={scope == 'Part time' ? styles.btnOption_checked : styles.btnOption}>{t('Part time')} </div>
                            <div onClick={() => handleScopeChange('Full time')} className={scope == 'Full time' ? styles.btnOption_checked : styles.btnOption}>{t('Full time')}</div>
                        </div>
                    </div>


                    {/*grey line*/}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={globalStyles.separate_line_grey}></div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'end', flex: '1 1 auto' }}>
                        <button style={{ width: '80px' }} onClick={post} className={globalStyles.btn}>{t('Post')}</button>
                    </div>
                </div>
            </Popup>
            <WarningPopup isOpen={showWarningPopup} onClose={() => setshowWarningPopup(false)} onConfirm={() => props.onClose(true)} onCancel={() => setshowWarningPopup(false)} warningText={t('Are you sure?')} />
        </>
    );
};

export default PostNewJobPopup;
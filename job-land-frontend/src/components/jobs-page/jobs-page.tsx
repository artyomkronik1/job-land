import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import React, { useCallback, useContext, useEffect, useState } from "react";
import JobFilterBtn from "../../base-components/job-filter-btn/job-filter-btn";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import { Job, JobFilters } from "../../interfaces/job";
import componentStyles from "../MainLayout/mainLayout.module.scss";
import axios from "axios";
import { DropdownProps } from "../../interfaces/dropdown";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import jobsStore from "../../store/job";
import EditProfileDialog from "../../dialogs/edit-profile/edit-profile";
import { User } from "../../interfaces/user";
import JobPopup from "../../dialogs/job-popup/job-popup";
import jobService from "../../services/jobService";
import SearchInput from "../../base-components/search-input/search-input";
import { Company } from "../../interfaces/company";
import CompanyService from "../../services/companyService";
import JobComponent from "../job-component/job-component";
import { JobContext } from "../../context/JobContext";
const JobsPage = observer(() => {
    const JobStore = useContext(JobContext);

    //language  
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [searchJobName, setsearchJobName] = useState('');
    const [searchJobLoc, setsearchJobLoc] = useState('');
    const [allCompanies, setAllCompanies] = useState<Company[]>(JobStore.companies)
    const [allJobs, setAllJobs] = useState<Job[]>(JobStore.filterJobs);
    // job filters array
    const [filterValues, setfilterValues] = useState<JobFilters>({
        zone: null,
        profession: null,
        region: null,
        manner: null,
        experienced_level: null,
        scope: null
    });
    // get jobs by filters that changed dynamically
    useEffect(() => {
        searchJob(); // Call the function when filters change
    }, [filterValues]);


    // get jobs by name or location that changed dynamically
    // useCallback for memoized filtering function
    const filterJobs = useCallback(() => {
        if (searchJobName.length > 0) {
            const filteredJobs = jobsStore.getfilterJobs().filter(job => {
                const matchesName = job.title.toLowerCase().includes(searchJobName.toLowerCase()) ||
                    job.hire_name.toLowerCase().includes(searchJobName.toLowerCase()) ||
                    job.zone.toLowerCase().includes(searchJobName.toLowerCase()) ||
                    job.profession.toLowerCase().includes(searchJobName.toLowerCase());
                return matchesName;
            });
            setAllJobs(filteredJobs);
        } else if (searchJobLoc.length > 0) {
            const filteredJobs = jobsStore.getfilterJobs().filter(job => {
                const matchesLoc = job.region.toLowerCase().includes(searchJobLoc.toLowerCase());
                return matchesLoc;
            });
            setAllJobs(filteredJobs);
        } else {
            setAllJobs(jobsStore.getfilterJobs());
        }
    }, [searchJobName, searchJobLoc]);

    // useEffect to apply filterJobs when searchJobName or searchJobLoc change
    useEffect(() => {
        filterJobs();
    }, [filterJobs]);

    // job full popup
    const [fullJob, setfullJob] = useState<Job>({
        id: "",
        title: "",
        description: "",
        salary: 0,
        hire_name: "",
        company_name: "",
        hire_manager_id: "",
        zone: "",
        profession: "",
        region: "",
        manner: "",
        experienced_level: "",
        scope: "",
        applications: []
    });


    const [openJob, setopenJob] = useState(false);

    const closePopup = (success: boolean) => {
        setopenJob(false)
    }
    const searchJob = async () => {
        try {
            // removing all null fields from propeties
            const nonNullFilters = Object.fromEntries(
                Object.entries(filterValues).filter(([key, value]) => value !== null)
            );
            const result = await jobService.getAllJobs(nonNullFilters);
            if (result.data.success) {
                jobsStore.setfilterJobs(result.data.jobs)
            }
            else {
                jobsStore.setfilterJobs([])
                return result.data
            }
        } catch (error) {
            jobsStore.setfilterJobs([])
            console.error('Error get jobs:', error);
        }
    }
    const addNewFilterValue = (newFilterValue: string, type: string) => {
        setfilterValues({
            ...filterValues,
            [type]: newFilterValue,
        });
    }// job filters by the all jobs properties
    const jobFilters: DropdownProps[] = [
        { filterName: 'zone', options: Array.from(new Set(jobsStore.getfilterJobs().map((job: Job) => job.zone))) },
        { filterName: 'profession', options: Array.from(new Set(jobsStore.getfilterJobs().map((job: Job) => job.profession))) },
        { filterName: 'region', options: Array.from(new Set(jobsStore.getfilterJobs().map((job: Job) => job.region))) },
        { filterName: 'manner', options: Array.from(new Set(jobsStore.getfilterJobs().map((job: Job) => job.manner))) },
        { filterName: 'experienced_level', options: Array.from(new Set(jobsStore.getfilterJobs().map((job: Job) => job.experienced_level))) },
        { filterName: 'scope', options: Array.from(new Set(jobsStore.getfilterJobs().map((job: Job) => job.scope))) },
    ]

    const jobFiltersHTML = jobFilters.map((value, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', zIndex: '10', height: '48px' }}>
            <JobFilterBtn text={t(value.filterName)} type={value.filterName} options={value.options} changeFilterValue={addNewFilterValue} />
        </div>
    ));
    const resetFilters = () => {
        UserStore.setLoading(true);
        setTimeout(async () => {
            UserStore.setLoading(false);
            setfilterValues({
                zone: null,
                profession: null,
                region: null,
                manner: null,
                experienced_level: null,
                scope: null
            })
            await searchJob();
        }, 500)
    }
    const handleLocationClick = (region: string) => {
        setsearchJobLoc(region); // Set the selected region to the input field
    };

    return (
        <>


            {openJob ? (
                <JobPopup isOpen={openJob} onClose={closePopup} children={fullJob} />
            ) : null}


            <div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
                <div style={{ marginTop: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >

                    {/*job filters*/}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', width: '100%', justifyContent: 'center' }} >
                        {jobFiltersHTML}
                        <button onClick={searchJob} style={{ width: '100px', height: '48px', display: 'flex', gap: '6px', padding: '10px' }} className={globalStyles.btn}>{t('Search')}
                            <i style={{ color: 'white', fontSize: '16px' }} className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                    {/*separate line*/}
                    <div style={{ width: '80%' }} className={globalStyles.separate_line_grey}> </div>

                    {/* job input search */}
                    <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'start', gap: '20px', marginTop: '20px', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', }}>
                            <SearchInput placeHolder={t('title, skill or company')} value={searchJobName} ariaLabel={'Search..'} onChange={(vaalue) => setsearchJobName(vaalue)} />

                            {searchJobName.length > 0 && (
                                <ul style={{
                                    display: 'flex', flexDirection: 'column', gap: '20px', position: 'absolute',
                                    width: '85%',
                                    top: '50px'
                                }}>
                                    {allJobs.map((job, index) => (
                                        job.title.toLowerCase().includes(searchJobName.toLowerCase()) && (
                                            <li onClick={() => setsearchJobName(job.title)} className={componentStyles.liSearchValues} key={index}><span className={componentStyles.mainSpan}>{job.title}</span></li>
                                        )
                                    )
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* job location */}
                        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <SearchInput icon="fa-solid fa-location-dot" placeHolder={t('location')} value={searchJobLoc} ariaLabel={'Search..'} onChange={(vaalue) => setsearchJobLoc(vaalue)} />

                            {searchJobLoc.length > 0 && (
                                <ul style={{
                                    display: 'flex', flexDirection: 'column', gap: '20px', position: 'absolute',
                                    width: '85%',
                                    top: '50px'
                                }}>
                                    {allJobs.map((job, index) => (
                                        job.region.toLowerCase().includes(searchJobLoc.toLowerCase()) && (
                                            <li onClick={() => handleLocationClick(job.region)} className={componentStyles.liSearchValues} key={index}><span className={componentStyles.mainSpan}>{job.region}</span></li>
                                        )
                                    )
                                    )}
                                </ul>
                            )}
                        </div>

                    </div>
                    {/*job component*/}
                    <div style={{ display: 'flex', flexDirection: 'column', width: '80%', alignSelf: 'center', cursor: 'pointer', gap: '20px' }}>


                        {allJobs && allJobs.length > 0 ? allJobs.map((job: Job, index) => (
                            <JobComponent job={job} />
                            // <div style={{ width: '90%' }} className={job.applications.includes(UserStore.user.id) ? componentStyles.jobContainerApplied : componentStyles.postContainer} key={index} onClick={() => seeFullJob(job)}>
                            //     {!job.applications.includes(UserStore.user.id) ? (
                            //         <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            //             <div className={componentStyles.postContainer__header}>
                            //                 <ProfileImage user={jobsStore.getCompanyInfoByCompanyName(job.company_name)} />
                            //                 <div className={componentStyles.postContainer__header__details}>
                            //                     <span style={{ fontSize: '20px', color: '#1c1c39' }}> {job.hire_name}</span>
                            //                     <span style={{ color: '#717273', fontSize: '16px', fontWeight: 'normal' }} className={globalStyles.simpleP}> {job.company_name}</span>
                            //                 </div>
                            //             </div>


                            //             <div>
                            //                 <span style={{ fontSize: '18px', color: '#717273', fontWeight: 'normal' }} className={globalStyles.simpleP}> {job.applications.length} {job.applications.length == 1 ? t(' person clicked apply') : t(' people clicked apply')}</span>

                            //             </div>
                            //         </div>
                            //     ) :
                            //         <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            //             <div className={componentStyles.postContainer__header}>
                            //                 <ProfileImage user={UserStore.getUserInfoById(job.hire_manager_id)} />
                            //                 <div className={componentStyles.postContainer__header__details}>
                            //                     <span style={{ fontSize: '20px', color: '#1c1c39' }}> {job.hire_name}</span>
                            //                     <span style={{ color: '#717273', fontSize: '16px', fontWeight: 'normal' }} className={globalStyles.simpleP}> {job.company_name}</span>
                            //                 </div>
                            //             </div>
                            //             <div>
                            //                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '5px' }}>
                            //                     <span style={{ fontSize: '18px', color: '#717273', fontWeight: 'normal' }} className={globalStyles.simpleP}> {job.applications.length} {job.applications.length == 1 ? t(' person clicked apply') : t(' people clicked apply')}</span>

                            //                     <span style={{ color: 'black  ', fontSize: '26px', fontWeight: 'normal' }} className={globalStyles.simpleP}> {t('Already applied')}</span>
                            //                 </div>
                            //             </div>
                            //         </div>
                            //     }

                            //     <div className={job.applications.includes(UserStore.user.id) ? componentStyles.jobContainerApplied__main : componentStyles.postContainer__main}>
                            //         <span style={{ fontSize: '19px', display: 'flex', color: '#555555', wordBreak: 'break-all', width: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}> {job.title}</span>
                            //         <span style={{ display: 'flex', color: '#717273', fontSize: '16px', fontWeight: 'normal', wordBreak: 'break-all', width: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}> {job.description}</span>
                            //     </div>
                            // </div>
                        )) : (
                            <div style={{ border: '1px solid #c3c4c5', backgroundColor: 'white', borderRadius: '20px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '90%' }}>
                                <span className={globalStyles.h2}>{t('No suitable jobs...')}</span>
                                <button onClick={() => resetFilters()} className={globalStyles.btn}>{t('Reset all filters')}</button>
                            </div>
                        )}
                    </div>


                </div>

            </div>
        </>

    );
})
export default JobsPage
import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import Login from "../login/login";
import styles from "../../assets/global-styles/styles.module.scss";
import JobFilterBtn from "../../base-components/job-filter-btn/job-filter-btn";
import DropDown from "../../base-components/dropdown-component/dropdown";
import {useNavigate} from "react-router";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import {Job, JobFilters} from "../../interfaces/job";
import componentStyles from "../MainLayout/mainLayout.module.scss";
import axios from "axios";
import {DropdownProps} from "../../interfaces/dropdown";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import jobsStore from "../../store/job";
const  JobsComponent  = observer( ()=>{
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [useSearchValue, setSearchValue] = useState('');
    // job filters array
    const [filterValues, setfilterValues] = useState<JobFilters>({
        zone:null,
        profession:null,
        region:null,
        manner:null,
        experienced_level:null,
        scope:null
    });
    // get jobs by filters that changed dynamically
    useEffect(() => {
        searchJob(); // Call the function when filters change
    }, [filterValues]);
    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    const searchJob=async()=>{
        try {
            // removing all null fields from propeties
            const nonNullFilters = Object.fromEntries(
                Object.entries(filterValues).filter(([key, value]) => value !== null)
            );
            const result = await axios.post('http://localhost:3002/jobs' ,{properties:nonNullFilters});
            if(result.data.success) {
                jobsStore.setfilterJobs(result.data.jobs)
            }
            else{
                jobsStore.setfilterJobs([])
                return result.data
            }
        } catch (error) {
           jobsStore.setfilterJobs([])
            console.error('Error get jobs:', error);
        }
    }
    const addNewFilterValue=(newFilterValue:string, type:string)=>{
        setfilterValues({
            ...filterValues,
            [type]: newFilterValue,
        });
    }// job filters
    const jobFilters:DropdownProps[]=[
        {filterName:'zone', options:['programming']},
        {filterName:'profession', options:['frontend_developer', 'it']},
        {filterName:'region', options:['israel', 'russia']},
        {filterName:'manner', options:['on_site', 'hybrid', 'remote']},
        {filterName:'experienced_level', options:['junior', 'mid_level', 'senior']},
        {filterName:'scope', options:['full_time', 'part_time']},
    ]
    const jobFiltersHTML= jobFilters.map((value,index)=>(
        <div key={index} style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
            <JobFilterBtn text={t(value.filterName)} type={value.filterName} options={value.options} changeFilterValue={addNewFilterValue}/>
        </div>
    ));
    const resetFilters = ()=>{
        UserStore.setLoading(true);
        setTimeout(async() => {
            UserStore.setLoading(false);
            setfilterValues({
                zone:null,
                profession:null,
                region:null,
                manner:null,
                experienced_level:null,
                scope:null})
            await searchJob();
        },500)


    }
    return (
        <>
            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                <div style={{marginTop:'90px',display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}} >
                    {/*job filters*/}
                    <div style={{display:'flex', flexWrap:'wrap', gap:'10px', alignItems:'center', width:'100%', justifyContent:'center'}} >
                        {jobFiltersHTML}
                            <button onClick={searchJob} style={{width:'100px', height:'48px', display:'flex',gap:'6px', padding:'10px'}} className={globalStyles.btn}>{t('Search')}
                                <i style={{color:'white', fontSize:'18px'}} className="fa fa-search" aria-hidden="true"></i>
                            </button>
                    </div>
                    {/*separate line*/}
                        <div style={{width:'80%'}} className={globalStyles.separate_line_grey}> </div>
                    {/*job component*/}
                    <div style={{display:"flex", justifyContent:'center', width:'100%'}}>
                        {jobsStore.filterJobs.length>0 ? jobsStore.filterJobs.map((job:Job,index)=>(
                            <div style={{width:'90%'}} className={componentStyles.postContainer} key={index}>
                                <div className={componentStyles.postContainer__header}>
                                    <ProfileImage name={job.hire_name}/>
                                    <div className={componentStyles.postContainer__header__details}>
                                        <span style={{fontSize:'20px', color:'#1c1c39'}}> {job.hire_name}</span>
                                        <span style={{color:'#717273',fontSize:'16px', fontWeight:'normal'}} className={globalStyles.simpleP}> {job.company_name}</span>
                                    </div>
                                </div>
                                <div className={componentStyles.postContainer__main}>
                                    <span  style={{  fontSize:'19px',display:'flex', color:'#555555',  wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {job.title}</span>
                                    <span style={{ display:'flex', color:'#717273',fontSize:'16px', fontWeight:'normal', wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {job.description}</span>
                                </div>
                            </div>
                        )):(
                            <div style={{border:'1px solid #c3c4c5', backgroundColor:'white', borderRadius:'20px', padding:'10px', display:'flex',flexDirection:'column', gap:'15px', alignItems:'center', width:'90%'}}>
                                <span className={globalStyles.h2}>{'No suitable jobs...'}</span>
                                <button onClick={()=>resetFilters()} className={globalStyles.btn}>{'Reset all filters'}</button>
                            </div>
                        )}
                    </div>


                </div>

            </div>
        </>

    );
} )
export default JobsComponent
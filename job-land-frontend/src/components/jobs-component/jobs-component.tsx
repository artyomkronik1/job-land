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
import {Job} from "../../interfaces/job";
import componentStyles from "../MainLayout/mainLayout.module.scss";
const  JobsComponent  = observer( ()=>{
    const navigate = useNavigate();
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();

    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    // job filters array
    const [filterValues, setfilterValues] = useState(['']);
    const addNewFilterValue=(newFilterValue:string)=>{
        if(!filterValues.includes(newFilterValue)) {
            setfilterValues([...filterValues, newFilterValue]);
        }
    }
    const [useSearchValue, setSearchValue] = useState('');
    // job filters
    const jobFilters=[
        {filterName:t('Zone'), options:['Programming']},
        {filterName:t('Profesion'), options:['Frontend Developer', 'IT']},
        {filterName:t('Region'), options:['Israel', 'Russia']},
        {filterName:t('Where'), options:['On-Site', 'Hybrid', 'Remote']},
        {filterName:t('Experienced level'), options:['Junior', 'Mid-level', 'Senior']},
        {filterName:t('How'), options:['Full time', 'Part time']},
    ]
    const jobFiltersHTML= jobFilters.map((value,index)=>(
        <div key={index} style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
            <JobFilterBtn text={value.filterName} options={value.options} changeFilterValue={addNewFilterValue}/>
        </div>
    ));

    return (
        <>
            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                <div className={styles.right_main}>
                    <div className={styles.right_main_main}>
                        <span className={globalStyles.simpleP}>{t('jobs')}</span>
                    </div>
                </div>

            </div>
        </>

    );
} )
export default JobsComponent
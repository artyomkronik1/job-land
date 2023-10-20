import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import Login from "../login/login";
import componentStyles from './network.module.scss'
import logo from'../../assets/images/icon.jpg'
import styles from "../../assets/global-styles/styles.module.scss";
import SearchInput from "../../base-components/search-input/search-input";
import he from "../../assets/images/languages/he.png";
import en from "../../assets/images/languages/en.png";
import SideBtnComponent from "../../base-components/side-btn/side-btn-component";
import JobFilterBtn from "../../base-components/job-filter-btn/job-filter-btn";
import DropDown from "../../base-components/dropdown-component/dropdown";
import {useNavigate} from "react-router";
import {Job} from "../../interfaces/job";
import axios from "axios";
import Spinner from "../../base-components/loading-spinner/loading-spinner";
const  NetworkComponent  = observer( ()=>{
    const navigate = useNavigate();
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    const [useSearchValue, setSearchValue] = useState('');
    // sidebar options
    const userMainOptions=[
        {type:'fa fa-home', name:'Home'} ,
        {type:'fa fa-message', name:'Messages'} ,
        {type:'fa fa-briefcase', name:'Jobs'} ,
        {type:'fa fa-users', name:'Network'} ,
        {type:'fa fa-plus-circle', name:'New Post'} ,
        {type:'fa fa-bell', name:'Notifications'} ]
    const sideBarMainOptionsHtml = userMainOptions.map((value, index) => (
        <div key={index} style={{display:'flex', justifyContent:'start',flexDirection:'column', gap:'5px'}}>
            <SideBtnComponent iconType={value.type} btnName={t(value.name)} onClick={()=>navigate(`/${userMainOptions[index].name.toLowerCase()}`)}/>
            <br/>
        </div>
    ));
    const bottomMainOptions=[
        {type:'fa fa-user-circle', name:'Profile'} ,
        {type:'fa fa-cog', name:'Settings'} ,
        {type:'fa fa-question-circle', name:t('Help & Support')} ] ;
    const bottomMainOptionsHtml = bottomMainOptions.map((value, index) => (
        <div key={index} style={{display:'flex', justifyContent:'start', flexDirection:'column', gap:'5px'}}>
            <SideBtnComponent iconType={value.type} btnName={t(value.name)}  onClick={()=>navigate(`/${bottomMainOptions[index].name.toLowerCase()}`)}/>
            <br/>
        </div>

    ));
    return (
        <>
                <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                    {UserStore.getSessionKey()? (
                                    <div className={styles.right_main_main}></div>
                        ) :
                        <Login/>
                    }
                </div>
        </>

    );
} )
export default NetworkComponent
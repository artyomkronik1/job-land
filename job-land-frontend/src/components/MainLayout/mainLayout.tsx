import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useState} from "react";
import {toast} from "react-toastify";
import Login from "../login/login";
import SignIn from "../signIn/signIn";
import styles from './mainLayout.module.scss'
import logo from'../../assets/images/icon.jpg'
import globalStyles from "../../assets/global-styles/styles.module.scss";
import SearchInput from "../../base-components/search-input/search-input";
import MessageBtn from "../../base-components/side-btn/side-btn-component";
import sendResume from '../../assets/images/mainLayout/sendResume.jpg'
import FilterBtn from "../../base-components/filter-btn/filter-btn";
import he from "../../assets/images/languages/he.png";
import en from "../../assets/images/languages/en.png";
import GreyBtn from "../../base-components/side-btn/side-btn-component";
import SideBtnComponent from "../../base-components/side-btn/side-btn-component";
const  MainLayout  = observer( ()=>{
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    const [useSearchValue, setSearchValue] = useState('');

    const userMainOptions=[
        {type:'fa fa-home', name:t('Home')} ,
        {type:'fa fa-message', name:t('Messages')} ,
        {type:'fa fa-briefcase', name:t('Jobs')} ,
        {type:'fa fa-users', name:t('Network')} ,
        {type:'fa fa-plus-circle', name:t('New Post')} ,
        {type:'fa fa-bell', name:t('Notifications')} ]
    const sideBarMainOptionsHtml = userMainOptions.map((value, index) => (
        <div key={index} style={{display:'flex', justifyContent:'start',marginInlineStart:'45px', flexDirection:'column', gap:'5px'}}>
            <SideBtnComponent iconType={value.type} btnName={value.name}/>
            <br/>
        </div>
    ));
    const bottomMainOptions=[
        {type:'fa fa-user-circle', name:t('Profile')} ,
        {type:'fa fa-cog', name:t('Settings')} ,
        {type:'fa fa-question-circle', name:t('Help & Support')} ] ;
    const bottomMainOptionsHtml = bottomMainOptions.map((value, index) => (
        <div key={index} style={{display:'flex', justifyContent:'start',marginInlineStart:'45px', flexDirection:'column', gap:'5px'}}>
            <SideBtnComponent iconType={value.type} btnName={value.name}/>
            <br/>
        </div>
    ));
    return (
      <div>
          {UserStore.getSessionKey()? (
              <div className={styles.main}>
                <div className={styles.left}>
                <img src={logo} className={styles.logoStyle} style={{display:'flex', justifyContent:'start'}}/>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'start'}} >
                        {sideBarMainOptionsHtml}
                    </div>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'start', bottom:'0px', position:'relative'}} >
                        {bottomMainOptionsHtml}
                    </div>
                </div>

                  <div className={styles.right}>
                      <div className={styles.right_header}>
                          {/*left side*/}
                          <div style={{display:'flex', alignItems:'center', gap:'40px', justifyContent:'start'}}>
                          <h1 className={globalStyles.h2}> {t('Seeking or offering')}</h1>
                            <SearchInput placeHolder={'search...'}  value={useSearchValue} ariaLabel={'Search..'} onChange={(vaalue)=>setSearchValue(vaalue)}/>
                          </div>
                          {/*user side*/}
                          <div style={{display:'flex',gap:'50px', alignItems:'center'}}>
                          <div style={{display:'flex',alignItems:'center', gap:'10px'}}>
                              <i style={{color: '#a9acb1', 'fontSize':'15px'}}  className="fa fa-caret-down"></i>
                                <span className={globalStyles.simpleP}>{UserStore.getUser().name}</span>
                              <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                              <div className={styles.languageDiv}>
                                  { UserStore.getLanguage()=='en' ?
                                      <img src={he} className={styles.heLanguagePic} onClick={()=>changeLanguage('he')}/>
                                      :
                                      <img src={en} className={styles.enlanguagePic}  onClick={()=>changeLanguage('en')}/>
                                  }
                              </div>

                          </div>
                          </div>
                      </div>
                      <div className={styles.right_main}>
                      <div className={styles.right_main_main}>
                          <img src={sendResume} />
                          <div style={{display:'flex', flexDirection:'column', justifyContent:'start'}}>
                              <FilterBtn  text={  'For you' }/>
                          </div>
                      </div>
                          <div className={styles.right_main_messages}>

                          </div>
                      </div>
                  </div>
              </div>
          ) :
            <Login/>
          }
      </div>
    );
} )
export default MainLayout
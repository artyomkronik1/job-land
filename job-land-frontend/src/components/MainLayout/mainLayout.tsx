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
import MessageBtn from "../../base-components/gray-btn/grey-btn-component";
import sendResume from '../../assets/images/mainLayout/sendResumejpg.jpg'
import FilterBtn from "../../base-components/filter-btn/filter-btn";
import he from "../../assets/images/languages/he.png";
import en from "../../assets/images/languages/en.png";
import GreyBtn from "../../base-components/gray-btn/grey-btn-component";
const  MainLayout  = observer( ()=>{
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    const [useSearchValue, setSearchValue] = useState('');
    const filterValues=[
        t('For You'),

    ]
    return (
      <div>
          {UserStore.getSessionKey()? (
              <div className={styles.main}>
                <div className={styles.left}>
                <img src={logo} />
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'start'}}>
                             <p>a</p>
                            <p>b</p>
                            <p>c</p>
                            <p>d</p>
                            <p>e</p>
                            <p>f</p>
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
                              <div style={{display:'flex', gap:'40px'}}>
                                  <GreyBtn faType={'fa fa-home'}/>
                                     <GreyBtn faType={'fa fa-message'}/>
                                  <GreyBtn faType={'fa fa-bell'}/>
                          </div>
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
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
import he from "../../assets/images/languages/he.png";
import en from "../../assets/images/languages/en.png";
import GreyBtn from "../../base-components/side-btn/side-btn-component";
import SideBtnComponent from "../../base-components/side-btn/side-btn-component";
import JobFilterBtn from "../../base-components/job-filter-btn/job-filter-btn";
const  MainLayout  = observer( ()=>{
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };
    // message box
    const [messageBoxIsOpen, setmessageBoxIsOpen] = useState(false);

    // startPost
    const startPost=()=>{

    }
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
    // sidebar options
    const userMainOptions=[
        {type:'fa fa-home', name:t('Home')} ,
        {type:'fa fa-message', name:t('Messages')} ,
        {type:'fa fa-briefcase', name:t('Jobs')} ,
        {type:'fa fa-users', name:t('Network')} ,
        {type:'fa fa-plus-circle', name:t('New Post')} ,
        {type:'fa fa-bell', name:t('Notifications')} ]
    const sideBarMainOptionsHtml = userMainOptions.map((value, index) => (
        <div key={index} style={{display:'flex', justifyContent:'start',flexDirection:'column', gap:'5px'}}>
            <SideBtnComponent iconType={value.type} btnName={value.name}/>
            <br/>
        </div>
    ));
    const bottomMainOptions=[
        {type:'fa fa-user-circle', name:t('Profile')} ,
        {type:'fa fa-cog', name:t('Settings')} ,
        {type:'fa fa-question-circle', name:t('Help & Support')} ] ;
    const bottomMainOptionsHtml = bottomMainOptions.map((value, index) => (
        <div key={index} style={{display:'flex', justifyContent:'start', flexDirection:'column', gap:'5px'}}>
            <SideBtnComponent iconType={value.type} btnName={value.name}/>
            <br/>
        </div>

    ));
    return (
      <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
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
                          {/*send resume */}
                          {/*<img src={sendResume} height="20%"  />*/}
                          {/*share a new post*/}
                            <div style={{display:'flex', flexDirection:'column', padding:'10px', marginTop:'30px',gap:'15px'}} className={globalStyles.basicForm}>
                                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                        <div style={{display:'flex', justifyContent:'start', padding:'10px 20px', borderRadius:'20px', border:'1px solid rgb(0 0 0/.6)', backgroundColor:'white', width:'100%'}}>
                                            <span onClick={startPost} style={{color:'rgb(0 0 0/.6)', fontWeight:'bold'}}> {t('Start a post...')}</span>
                                        </div>
                                    </div>
                                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
                                    <div style={{display:'flex', gap:'6px'}}> {t('Media')} <i style={{color:'red'}} className="fa-solid fa-image"></i> </div>
                                    <div style={{display:'flex', gap:'6px', }}>  {t('Write article')} <i style={{color:'blue'}} className="fa fa-newspaper"></i></div>
                                </div>

                            </div>
                          {/*job filters*/}
                          {/*<div style={{display:'flex', gap:'15px', marginTop:'20px',alignItems:'center'}}>*/}
                          {/*{jobFiltersHTML}*/}
                          {/*    <button style={{width:'100px', height:'40px', display:'flex',gap:'6px', padding:'10px'}} className={globalStyles.btn}>{t('Search')}*/}
                          {/*        <i style={{color:'white'}} className="fa fa-search" aria-hidden="true"></i>*/}
                          {/*    </button>*/}
                          {/*  </div>*/}
                      {/*    posts*/}
                          <div style={{marginTop:'30px'}}>
                          <div className={styles.postContainer}>
                              <div className={styles.postContainer__header}>
                                  <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                  <div className={styles.postContainer__header__details}>
                                      <span className={globalStyles.simpleP}> {'artiommm'}</span>
                                      <span style={{fontSize:'16px', fontWeight:'normal'}} className={globalStyles.simpleP}> {'atmos'}</span>
                                  </div>
                              </div>
                              <div className={styles.postContainer__main}>
                                  <span style={{display:'flex',  wordWrap: 'break-word', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}>  {'blalalaalalalaalaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddd'}</span>
                              </div>
                          </div>
                          </div>

                      </div>
                          {/*messages*/}
                          <div className={styles.right_main_messages }>
                              {messageBoxIsOpen}
                          {/*    open all message box*/}

                              <div  className={`${styles.fade_in} ${messageBoxIsOpen ? `${styles.allMessagesContainer_visible}` :`${styles.allMessagesContainer_hidden}`}`}>
                                  {/*all user chats*/}
                                  <div className={styles.allMessagesContainer}  >
                                      <div  >
                                          <div className={styles.messageContainer}>
                                              <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                              <div style={{   display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                                  <span className={globalStyles.simpleP}> {UserStore.getUser().name}</span>
                                                  <span style={{fontSize:'16px', fontWeight:'normal'}} className={globalStyles.simpleP}> {UserStore.getUser().role}</span>
                                              </div>
                                              {UserStore.getLanguage()=='en'?( <i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-right" ></i>)
                                                  :(<i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-left"></i>)
                                              }
                                          </div>
                                          <div style={{marginTop:'5px', marginBottom:'15px', marginInlineStart:'15px' ,display:'flex', width:'88%',  borderBottom:'0.5px solid #e8e8e8'}}> </div>

                                          <div className={styles.messageContainer}>
                                              <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                              <div style={{display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                                  <span className={globalStyles.simpleP}> {UserStore.getUser().name}</span>
                                                  <span style={{fontSize:'16px', fontWeight:'normal'}} className={globalStyles.simpleP}> {UserStore.getUser().role}</span>
                                              </div>
                                              {UserStore.getLanguage()=='en'?( <i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-right" ></i>)
                                                  :(<i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-left"></i>)
                                              }
                                          </div>
                                          <div style={{marginTop:'5px', marginBottom:'15px', marginInlineStart:'15px' ,display:'flex', width:'88%',  borderBottom:'0.5px solid #e8e8e8'}}> </div>

                                          <div className={styles.messageContainer}>
                                              <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                              <div style={{display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                                  <span className={globalStyles.simpleP}> {UserStore.getUser().name}</span>
                                                  <span style={{fontSize:'16px', fontWeight:'normal'}} className={globalStyles.simpleP}> {UserStore.getUser().role}</span>
                                              </div>
                                              {UserStore.getLanguage()=='en'?( <i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-right" ></i>)
                                                  :(<i style={{color:'#0a66c2'}} className="fa fa-arrow-circle-left"></i>)
                                              }

                                          </div>
                                          <div style={{marginTop:'5px', marginBottom:'15px', marginInlineStart:'15px' ,display:'flex', width:'88%',  borderBottom:'0.5px solid #e8e8e8'}}> </div>

                                      </div>

                                  </div>
                              </div>
                              <div style={{backgroundColor:'white'}} onClick={()=> setmessageBoxIsOpen(!messageBoxIsOpen)}>
                                  <div className={styles.messageContainerMain}>
                                      <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                      <div style={{display:'flex', flexDirection:'column', alignItems:'start', justifyContent:'space-around'}}>
                                          <span className={globalStyles.simpleP}> {UserStore.getUser().name}</span>
                                          <span style={{fontSize:'16px', fontWeight:'normal'}} className={globalStyles.simpleP}> {'1'}</span>
                                      </div>
                                  </div>
                              </div>

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
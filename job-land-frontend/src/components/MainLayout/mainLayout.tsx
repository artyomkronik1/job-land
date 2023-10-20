import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import Login from "../login/login";
import componentStyles from './mainLayout.module.scss'
import styles from '../../assets/global-styles/styles.module.scss'
import globalStyles from "../../assets/global-styles/styles.module.scss";
import {useNavigate} from "react-router";
import {Job} from "../../interfaces/job";
import axios from "axios";
const  MainLayout  = observer( ()=>{
    const navigate = useNavigate();
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [jobs, setjobs] = useState<Job[]>([]);
    useEffect(() => {
        getAllJobs();
    }, []);

    // getAllJobs - posts
    const getAllJobs=async()=>{
            try {
                const result = await axios.post('http://localhost:3002/jobs', {followers:UserStore.getUser().follow.toString()});
                if(result.data.success) {
                  setjobs(result.data.jobs)
                }
                else{
                    return result.data
                }
            } catch (error) {
                console.error('Error get jobs:', error);
            }

    }
    const startPost =()=>{

    }
    const goToNetwork =()=>{
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            navigate('/network')
        },1000)
    }
    const changeLanguage = (lng:string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };

    return (
        <>
            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                                <div className={styles.right_main}>
                                    <div className={styles.right_main_main}>
                                        {/*send resume */}
                                        {/*<img src={sendResume} height="20%"  />*/}
                                        {/*share a new post*/}
                                        <div style={{ display:'flex', flexDirection:'column', padding:'10px', marginTop:'30px',gap:'15px'}} className={globalStyles.basicForm}>
                                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                                <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                                <div style={{display:'flex', justifyContent:'start', padding:'10px 20px', borderRadius:'20px', border:'1px solid #a9acb1', backgroundColor:'white', width:'100%'}}>
                                                    <span onClick={startPost} style={{color:'#a9acb1', fontWeight:'bold'}}> {t('Start a post...')}</span>
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
                                        <div style={{display:'flex', justifyContent:'center'}}>
                                          <div className={globalStyles.separate_line_grey}> </div>
                                        </div>
                                        <div >
                                            {jobs.length>0? jobs.map((job:Job,index)=>(
                                                <div className={componentStyles.postContainer} key={index}>
                                                    <div className={componentStyles.postContainer__header}>
                                                        <div style={{width:'50px', height:'50px',background:'blue',borderRadius:'50%'}}></div>
                                                        <div className={componentStyles.postContainer__header__details}>
                                                            <span style={{fontSize:'20px', color:'#1c1c39'}}> {job.hire_name}</span>
                                                            <span style={{color:'#717273',fontSize:'16px', fontWeight:'normal'}} className={globalStyles.simpleP}> {job.company_name}</span>
                                                        </div>
                                                    </div>
                                                    <div className={componentStyles.postContainer__main}>
                                                        <span  style={{  fontSize:'19px',display:'flex', color:'#555555',  wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {job.title}</span>
                                                        <span style={{ display:'flex', color:'#717273',fontSize:'16px', fontWeight:'normal', wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {job.description}</span>
                                                    </div>
                                                </div>   )):(

                                                <div style={{border:'1px solid #c3c4c5', backgroundColor:'white', borderRadius:'20px', padding:'10px', display:'flex',flexDirection:'column', gap:'30px', alignItems:'center'}}>
                                                    <span className={globalStyles.h2}>{'There is no posts...'}</span>
                                                    <button onClick={()=>goToNetwork()} className={globalStyles.btn}>{'Start follow'}</button>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

            </div>
        </>

    );
} )
export default MainLayout
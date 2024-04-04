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
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import {Post} from "../../interfaces/post";
import StartPost from "../../dialogs/start-post/start-post";
import jobsStore from "../../store/job";
import {toast} from "react-toastify";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import {DashboardContext} from "../../context/dashboardContext";
import ProfileComponent from "../profile-component/profile-component";
import {User} from "../../interfaces/user";
const  MainLayout  = observer( ()=>{
    const [startIndex, setStartIndex] = useState(0);
    const navigate = useNavigate();
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [posts, setPosts] = useState<Post[]>(jobsStore.followPost);
    const [openPopup, setopenPopup] = useState(false);

    // update every 5 minutes the posts
    useEffect(() => {
         getAllPosts()
    }, []);


    const closePopup=(success:boolean)=>{
        if(success){
            UserStore.setLoading(true);
            setTimeout(() => {
                UserStore.setLoading(false);
                toast.success(t('SUCCESS'));
                setopenPopup(false)
            },1000)
        }
        setopenPopup(false)
    }
    // getAllJobs - posts
    const getAllPosts=async()=>{
            try {
                const result = await axios.get('http://localhost:3002/posts');
                if(result.data.success) {
                    // filter only the posts user follow or itself posts
                    const postsFollowedbyUser = result.data.posts.filter((post: Post) => {
                        return UserStore.user.follow.includes(post.employee_id) || UserStore.user.id == post.employee_id ;
                    });
                    setPosts(postsFollowedbyUser.reverse())
                }
                else{
                    setPosts([])
                    return result.data

                }
            } catch (error) {
                setPosts([])
                console.error('Error get posts:', error);
            }

    }
    const startPost =()=>{
        setopenPopup(true);
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


    const goToUserProfile =  (name:string)=>{
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            navigate(`/profile/${name}`);
            UserStore.setTab("Profile")
        },1000)
    }

    return (
        <>

            {openPopup&&(
                <StartPost isOpen={openPopup} onClose={closePopup}/>
            )}
            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                                <div>
                                    <div >
                                        {/*send resume */}
                                        {/*<img src={sendResume} height="20%"  />*/}
                                        {/*share a new post*/}
                                        <div style={{ display:'flex', flexDirection:'column', padding:'10px', marginTop:'50px',gap:'15px'}} className={globalStyles.basicForm}>
                                            <div onClick={startPost} style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                                <ProfileImage name={UserStore.user.name}/>
                                                <div style={{display:'flex', justifyContent:'start', padding:'10px 20px', borderRadius:'20px', border:'1px solid #a9acb1', backgroundColor:'white',flex:'1 1 auto'}}>
                                                    <span  style={{color:'#a9acb1', fontSize:'19px', fontWeight:'bold'}}> {t('Start a post...')}</span>
                                                </div>
                                            </div>
                                            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
                                                <div style={{display:'flex', gap:'6px'}}> {t('Media')} <i style={{color:'red'}} className="fa-solid fa-image"></i> </div>
                                                <div style={{display:'flex', gap:'6px', }}>  {t('Write article')} <i style={{color:'blue'}} className="fa fa-newspaper"></i></div>
                                            </div>

                                        </div>
                                        {/*    posts*/}
                                        <div style={{display:'flex', justifyContent:'center'}}>
                                          <div className={globalStyles.separate_line_grey}> </div>
                                        </div>
                                        <div  style={{display:'flex', flexDirection:'column', gap:'20px'}}>

                                            {posts.length>0? posts.map((post:Post, index)=>(
                                                <div className={componentStyles.postContainer} key={index}>
                                                    <div className={componentStyles.postContainer__header} onClick={()=>goToUserProfile(post.writer_name)}>
                                                        <ProfileImage name={post.writer_name}/>
                                                        <div className={componentStyles.postContainer__header__details}>
                                                            <span style={{fontSize:'20px', color:'#1c1c39'}}> {post.writer_name}</span>
                                                            <span style={{color:'#717273',fontSize:'16px', fontWeight:'normal'}} className={globalStyles.simpleP}> {UserStore.users.filter(user=>user.id== post.employee_id)[0]?.about}</span>
                                                        </div>
                                                    </div>
                                                    <div className={componentStyles.postContainer__main}>
                                                        <span  style={{  fontSize:'19px',display:'flex', color:'#555555',  wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {post.title}</span>
                                                        <span style={{ display:'flex', color:'#717273',fontSize:'16px', fontWeight:'normal', wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {post.description}</span>
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

            {/*toast*/}
            <ToastComponent />
        </>

    );
} )
export default MainLayout
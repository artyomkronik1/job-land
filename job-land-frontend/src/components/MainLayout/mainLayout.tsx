import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import Login from "../login/login";
import componentStyles from './mainLayout.module.scss'
import styles from '../../assets/global-styles/styles.module.scss'
import globalStyles from "../../assets/global-styles/styles.module.scss";
import {useNavigate} from "react-router";
import editImg from '../../assets/images/edit.png'
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
import PostsService from "../../services/postService";
import EditPost from "../../dialogs/edit-post/edit-post";
const  MainLayout  = observer( ()=>{
    const [startIndex, setStartIndex] = useState(0);
    const navigate = useNavigate();
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [posts, setPosts] = useState<Post[]>(jobsStore.followPost);
    const [openPopup, setopenPopup] = useState(false);
    const [editPost, setEditPost] = useState(false);
    const [editingPost, seteditingPost] = useState<Post>({
        id: "",
        title: "",
        description: "",
        employee_id:"",
        writer_name:"",
    });


    // update every 5 minutes the posts
    useEffect(() => {
         getAllPosts()
    }, []);

    const openEditingPost=(post:Post)=>{
        seteditingPost(post)
        setEditPost(true)
    }
    const closePopup=(success:boolean)=>{
        console.log(success)
        if(success){
            UserStore.setLoading(true);
            setTimeout(() => {
                UserStore.setLoading(false);
                toast.success(t('SUCCESS'));
                setopenPopup(false)
            },1000)
        }
        setEditPost(false)
        setopenPopup(false)
    }
    // getAllJobs - posts
    const getAllPosts=async()=>{
      setPosts(await PostsService.getAllPosts())

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
            {editPost&&(
            <EditPost postForEdit={editingPost} isOpen={editPost} onClose={closePopup}/>
            )}
            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                                <div>
                                    <div >
                                        {/*send resume */}
                                        {/*<img src={sendResume} height="20%"  />*/}
                                        {/*share a new post*/}
                                        <div style={{ display:'flex', cursor:'pointer', flexDirection:'column', padding:'10px', marginTop:'50px',gap:'15px'}} className={globalStyles.basicForm}>
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
                                                   <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                                                    <div className={componentStyles.postContainer__header} onClick={()=>goToUserProfile(post.writer_name)}>
                                                        <ProfileImage name={post.writer_name}/>
                                                        <div className={componentStyles.postContainer__header__details}>
                                                            <span style={{fontSize:'20px', color:'#1c1c39'}}> {post.writer_name}</span>
                                                            <span style={{color:'#717273',fontSize:'16px', fontWeight:'normal'}} className={globalStyles.simpleP}> {UserStore.users.filter(user=>user.id== post.employee_id)[0]?.about}</span>
                                                        </div>
                                                    </div>
                                                       {UserStore.user.id == post.employee_id &&(
                                                    <img onClick={()=>openEditingPost(post)} src={editImg} style={{width:'20px', height:'20px', padding:'10px', cursor:'pointer'}}/>
                                                       )}
                                                   </div>

                                                    <div className={componentStyles.postContainer__main}>
                                                        {/*<span  style={{  fontSize:'19px',display:'flex', color:'#555555',  wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {post.title}</span>*/}
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
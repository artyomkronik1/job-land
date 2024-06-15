import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import JobFilterBtn from "../../base-components/job-filter-btn/job-filter-btn";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import {Job, JobFilters} from "../../interfaces/job";
import componentStyles from "../MainLayout/mainLayout.module.scss";
import axios from "axios";
import {DropdownProps} from "../../interfaces/dropdown";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import jobsStore from "../../store/job";
import EditProfileDialog from "../../dialogs/edit-profile/edit-profile";
import {User} from "../../interfaces/user";
import JobPopup from "../../dialogs/job-popup/job-popup";
import jobService from "../../services/jobService";
import {useNavigate, useParams} from "react-router";
import editImg from "../../assets/images/edit.png";
import {Post} from "../../interfaces/post";
import EditPost from "../../dialogs/edit-post/edit-post";
import {toast} from "react-toastify";
const  PostComponent  = observer( ()=>{
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const { postId }:any = useParams();
    const [post, setPost] = useState<Post>(jobsStore.getPostInfoById(postId));
    const navigate = useNavigate();
    const [editPost, setEditPost] = useState(false);
    const [editingPost, seteditingPost] = useState<Post>({
        _id: "",
        title: "",
        description: "",
        employee_id:"",
        writer_name:"",
        likedBy:[],
    });
    const openEditingPost=(post:Post)=>{
        seteditingPost(post)
        setEditPost(true)
    }

    useEffect(() => {
        setPost(jobsStore.getPostInfoById(postId))
    }, [editPost]);
    const goToUserProfile =  (name:string)=>{
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            navigate(`/profile/${name}`);
            UserStore.setTab("Profile")
        },1000)
    }
    const closePopup=(success:boolean)=>{
        if(success){

            UserStore.setLoading(true);
            setTimeout(() => {
                UserStore.setLoading(false);
                toast.success(t('SUCCESS'));
            },1000)
        }
        setEditPost(false)
    }

    return (
        <>


            {editPost&&(
                <EditPost postForEdit={editingPost} isOpen={editPost} onClose={closePopup}/>
            )}

            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                <div style={{marginTop:'90px',display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}} >

                    <div className={componentStyles.postContainer} style={{width:'100%'}}>
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
                    </div>
                </div>

            </div>
        </>

    );
} )
export default PostComponent
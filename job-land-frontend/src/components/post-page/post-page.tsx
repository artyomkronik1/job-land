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
import like from "../../assets/images/like.png";
import liked from "../../assets/images/liked.png";
import comment from '../../assets/images/comment.png'
import PostComponen from "../post-component/post-componen";
const  PostPage  = observer( ()=>{
    const [likeFlag, setlike] = useState(false);

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
        comments:[]
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
    useEffect(() => {
        setPost(jobsStore.getPostInfoById(postId))
    }, [likeFlag]);
    const setLikeOnPost = (event:any, post:Post)=>{

        event.stopPropagation();
        jobsStore.setLikeOnPost(post, UserStore.user.id, post.likedBy.includes(UserStore.user.id))
        setlike(!likeFlag)
    }
    return (
        <>


            {editPost&&(
                <EditPost postForEdit={editingPost} isOpen={editPost} onClose={closePopup}/>
            )}

                <div style={{marginTop:'90px'}}>
                  <PostComponen postId={post._id}/>
                </div>

        </>

    );
} )
export default PostPage
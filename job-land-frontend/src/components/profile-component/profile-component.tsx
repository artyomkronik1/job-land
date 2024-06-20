import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import Login from "../login/login";
import editImg from '../../assets/images/edit.png'

import styles from "../../assets/global-styles/styles.module.scss";
import JobFilterBtn from "../../base-components/job-filter-btn/job-filter-btn";
import DropDown from "../../base-components/dropdown-component/dropdown";
import {useNavigate, useParams} from "react-router";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import {Job} from "../../interfaces/job";
import componentStyles from "../MainLayout/mainLayout.module.scss";
import {DashboardContext} from "../../context/dashboardContext";
import {User} from "../../interfaces/user";
import jobsStore from "../../store/job";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import {Post} from "../../interfaces/post";
import axios from "axios";
import {toast} from "react-toastify";
import StartPost from "../../dialogs/start-post/start-post";
import EditProfileDialog from "../../dialogs/edit-profile/edit-profile";
import EditPost from "../../dialogs/edit-post/edit-post";
import success = toast.success;
import postService from "../../services/postService";
import like from "../../assets/images/like.png";
import liked from "../../assets/images/liked.png";
import comment from "../../assets/images/comment.png";
import PostComponent from "../post-component/post-componen";
const  ProfileComponent  = observer( ()=>{
    // params
    const { username } = useParams();
    const [user, setuser] = useState<User>( username ? UserStore.getUserByName(username) : UserStore.user);

    const navigate = useNavigate();
    const [openPopup, setopenPopup] = useState(false);
    const [editPostPopup, seteditPostPopup] = useState(false);
    const [editPost, seteditPost] = useState<Post>({
        likedBy:[],
        _id: "",
        title: "",
        description: "",
        employee_id:"",
        writer_name:"",
        comments:[]
    });


    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    // job filters array
    const [filterValues, setfilterValues] = useState(['']);
    const [usersPosts, setusersPosts] = useState([]);
    // update every 5 minutes the posts
    useEffect(() => {
        getPostByUserId();
    }, []);
    const addNewFilterValue=(newFilterValue:string)=>{
        if(!filterValues.includes(newFilterValue)) {
            setfilterValues([...filterValues, newFilterValue]);
        }
    }
    const goToPost =  (post:Post)=>{

            UserStore.setLoading(true);
            setTimeout(() => {
                UserStore.setLoading(false);
                navigate(`/posts/${post._id}`);
                UserStore.setTab("Home")
            }, 1000)

    }
    // edit profile
    const editProfile =()=>{
        if(username && username===UserStore.user.name) {
            setopenPopup(true);
        }
        else if(!username || username.length==0) {
            setopenPopup(true);

        }
        }

    const closeEditProfilePopup = async (hasUpdatedProdile:boolean)=>{
        setopenPopup(false)
        if(hasUpdatedProdile)
        {
            setuser(UserStore.user)

        }
    }
    const closeEditPostPopup = async (hasUpdatedPosts:boolean)=>{
        if(hasUpdatedPosts)
        {
            await getPostByUserId();
        }
        seteditPostPopup(false)
    }
    const [likeFlag, setlike] = useState(false);

    const openEditPost = (event: any, postToEdit:Post)=>{
        event.stopPropagation();
        if(username && username===UserStore.user.name) {

            seteditPost(postToEdit);
            seteditPostPopup(true)
        }
        else if(!username || username.length==0){
            seteditPost(postToEdit);
            seteditPostPopup(true)
        }
    }
   const  getPostByUserId = async ()=>{
        try {
            //sent
            const allPostsByUser = await postService.getPostByUserId(user);
            if(allPostsByUser.data.success) {
                setusersPosts(allPostsByUser.data.posts)
            }
        } catch (error) {
            console.error('Error getting users messages', error);
        }
    }
    const setLikeOnPost = (event:any, post:Post)=>{

        event.stopPropagation();
        jobsStore.setLikeOnPost(post, UserStore.user.id, post.likedBy.includes(UserStore.user.id))
        setlike(!likeFlag)
    }

    return (
        <>

            {openPopup && (user && user.name.length>0) && (
                <EditProfileDialog isOpen={openPopup} onClose={closeEditProfilePopup} profileForEdit={user}  />
            ) }


            {editPostPopup&&(
                <EditPost isOpen={editPostPopup} onClose={closeEditPostPopup} postForEdit={editPost} />
            )}
            <div dir={ UserStore.getLanguage()=='en'?'ltr':'rtl'}>
                <div style={{marginTop:'90px',display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}} >
                    {/*job filters*/}
                    <div onClick={editProfile} style={{display:'flex', flexWrap:'wrap', gap:'10px', alignItems:'center', width:'100%', justifyContent:'center'}} >
                       <div style={{display:'flex', justifyContent:'space-between', width:'90%', alignItems:'center'}}>
                        <div style={{flexDirection:'row' , gap:'10px', alignItems:'center', display:'flex'}}>
                        <ProfileImage name={user.name} size={'big'} />
                            <div style={{display:'flex', flexDirection:'column'}}>
                           <span className={styles.mainSpan} style={{fontSize:'25px'}}>{user.name}</span>
                            <span className={styles.mainSpan} style={{fontSize:'18px'}}>{user.about}</span>
                            </div>
                         </div>
                           <div style={{display:'flex', flexDirection:'column', gap:'5px', }}>
                               <span>last experience</span>
                               <span>last education</span>
                           </div>
                       </div>
                    </div>
                    {/*separate line*/}
                    <div style={{width:'90%'}} className={globalStyles.separate_line_grey}> </div>
                {/*  users posts*/}
                    <div  style={{display:'flex', flexDirection:'column', width:'100%'}}>

                        { usersPosts.map((post:Post, index)=>(

                            <PostComponent postId={post._id}/>

                        ))}
                    </div>

                </div>

            </div>
        </>

    );
} )
export default ProfileComponent
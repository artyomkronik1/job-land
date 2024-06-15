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
const  ProfileComponent  = observer( ()=>{
    // params
    const { username } = useParams();
    const [user, setuser] = useState<User>( username ? UserStore.getUserByName(username) : UserStore.user);

    const navigate = useNavigate();
    const [openPopup, setopenPopup] = useState(false);
    const [editPostPopup, seteditPostPopup] = useState(false);
    const [editPost, seteditPost] = useState<Post>({
        _id: "",
        title: "",
        description: "",
        employee_id:"",
        writer_name:"",
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
    // job filters
    const jobFilters=[
        {filterName:t('Zone'), options:['Programming']},
        {filterName:t('Profesion'), options:['Frontend Developer', 'IT']},
        {filterName:t('Region'), options:['Israel', 'Russia']},
        {filterName:t('Where'), options:['On-Site', 'Hybrid', 'Remote']},
        {filterName:t('Experienced level'), options:['Junior', 'Mid-level', 'Senior']},
        {filterName:t('How'), options:['Full time', 'Part time']},
    ]
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
    const jobFiltersHTML= jobFilters.map((value,index)=>(
        <div key={index} style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
            <JobFilterBtn text={value.filterName} type={value.filterName} options={value.options} changeFilterValue={addNewFilterValue}/>
        </div>
    ));

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
                    <div  style={{display:'flex', flexDirection:'column', gap:'20px', width:'100%'}}>

                        { usersPosts.map((post:Post, index)=>(
                            <div className={componentStyles.postContainer} key={index}  onClick={()=>goToPost(post)} >
                                <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>

                                <div className={componentStyles.postContainer__header} >
                                    <ProfileImage name={post.writer_name}/>
                                    <div className={componentStyles.postContainer__header__details}>
                                        <span style={{fontSize:'20px', color:'#1c1c39'}}> {post.writer_name}</span>
                                        <span style={{color:'#717273',fontSize:'16px', fontWeight:'normal'}} className={globalStyles.simpleP}> {UserStore.users.filter(user=>user.id== post.employee_id)[0]?.about}</span>
                                    </div>
                                </div>
                                {UserStore.user.id == post.employee_id &&(
                                    <img onClick={(event)=>openEditPost(event,post)} src={editImg} style={{width:'20px', height:'20px', padding:'10px', cursor:'pointer'}}/>
                                )}
                            </div>
                                <div className={componentStyles.postContainer__main}>
                                    {/*<span  style={{  fontSize:'19px',display:'flex', color:'#555555',  wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {post.title}</span>*/}
                                    <span style={{ display:'flex', color:'#717273',fontSize:'16px', fontWeight:'normal', wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {post.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </>

    );
} )
export default ProfileComponent
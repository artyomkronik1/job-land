import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import React, { useContext, useEffect, useState } from "react";
import Login from "../login/login";
import editImg from '../../assets/images/edit.png'

import styles from "../../assets/global-styles/styles.module.scss";
import JobFilterBtn from "../../base-components/job-filter-btn/job-filter-btn";
import DropDown from "../../base-components/dropdown-component/dropdown";
import { useNavigate, useParams } from "react-router";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import { Job } from "../../interfaces/job";
import componentStyles from "../MainLayout/mainLayout.module.scss";
import { DashboardContext } from "../../context/dashboardContext";
import { User } from "../../interfaces/user";
import jobsStore from "../../store/job";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import { Post } from "../../interfaces/post";
import axios from "axios";
import { toast } from "react-toastify";
import StartPost from "../../dialogs/start-post/start-post";
import EditProfileDialog from "../../dialogs/edit-profile/edit-profile";
import EditPost from "../../dialogs/edit-post/edit-post";
import success = toast.success;
import postService from "../../services/postService";
import like from "../../assets/images/like.png";
import liked from "../../assets/images/liked.png";
import comment from "../../assets/images/comment.png";
import PostComponent from "../post-component/post-componen";
import PicturePopup from "../../dialogs/picturePopup/picture-popup";
const ProfileComponent = observer(() => {
    // params
    const { username } = useParams();
    const [user, setuser] = useState<User>(username ? UserStore.getUserByName(username) : UserStore.user);

    const navigate = useNavigate();
    const [openPopup, setopenPopup] = useState(false);
    const [editPostPopup, seteditPostPopup] = useState(false);
    const [editPost, seteditPost] = useState<Post>({
        likedBy: [],
        _id: "",
        title: "",
        description: "",
        employee_id: "",
        writer_name: "",
        comments: []
    });
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [usersPosts, setusersPosts] = useState([]);
    const [showPicturePopup, setshowPicturePopup] = useState('');
    const [isProfilePic, setisProfilePic] = useState(false);

    // update every 5 minutes the posts
    useEffect(() => {
        getPostByUserId();
    }, []);


    // edit profile
    const editProfile = () => {
        if (username && username === UserStore.user.name) {
            setopenPopup(true);
        }
        else if (!username || username.length == 0) {
            setopenPopup(true);

        }
    }

    const closeEditProfilePopup = async (hasUpdatedProdile: boolean) => {
        setopenPopup(false)
        if (hasUpdatedProdile) {
            setuser(UserStore.user)

        }
    }
    const closeEditPostPopup = async (hasUpdatedPosts: boolean) => {
        if (hasUpdatedPosts) {
            await getPostByUserId();
        }
        seteditPostPopup(false)
    }
    const getPostByUserId = async () => {
        try {
            //sent
            const allPostsByUser = await postService.getPostByUserId(user);
            if (allPostsByUser.data.success) {
                setusersPosts(allPostsByUser.data.posts)
            }
        } catch (error) {
            console.error('Error getting users messages', error);
        }
    }
    const editPicture = (pic: string, isProfile: boolean) => {
        setshowPicturePopup(pic)
        setisProfilePic(isProfile)
    }
    const closeeditPicture = () => {
        setshowPicturePopup('')
        setisProfilePic(false)
    }
    return (
        <>

            {openPopup && (user && user.name.length > 0) && (
                <EditProfileDialog isOpen={openPopup} onClose={closeEditProfilePopup} profileForEdit={user} />
            )}


            {editPostPopup && (
                <EditPost isOpen={editPostPopup} onClose={closeEditPostPopup} postForEdit={editPost} />
            )}


            {showPicturePopup.length > 0 && (
                <PicturePopup isProfile={isProfilePic} onClose={closeeditPicture} picture={showPicturePopup} isOpen={showPicturePopup.length > 0} />
            )}

            <div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
                <div style={{ marginTop: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >

                    <div style={{ background: 'white', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', width: '100%', justifyContent: 'center' }} >

                        <img onClick={() => editPicture(UserStore.user.backgroundPicture, false)} src={UserStore.user.backgroundPicture} style={{ display: 'flex', width: '100%', height: '250px' }} />

                        <div onClick={() => editPicture(UserStore.user.profilePicture, true)} style={{ position: 'absolute', left: '100px', marginTop: '40px' }}><ProfileImage user={UserStore.user} size="big" /></div>
                        <div onClick={editProfile} style={{ marginBottom: '30px', marginTop: '100px', flexDirection: 'row', display: 'flex', width: '90%', alignItems: 'baseline', justifyContent: 'space-between' }}>
                            <div style={{ flexDirection: 'row', gap: '10px', alignItems: 'center', display: 'flex' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className={styles.mainSpan} style={{ fontSize: '25px' }}>{user.name}</span>
                                    <span className={styles.mainSpan} style={{ fontSize: '18px' }}>{user.about}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', }}>
                                <span>last experience</span>
                                <span>last education</span>
                            </div>
                        </div>
                    </div>
                    {/*separate line*/}
                    <div style={{ width: '100%' }} className={globalStyles.separate_line_grey}> </div>
                    {/*  users posts*/}
                    <div style={{ display: 'flex', flexDirection: 'column', width: '99%' }}>

                        {usersPosts.map((post: Post, index) => (

                            <PostComponent postId={post._id} />

                        ))}
                    </div>

                </div>

            </div >
        </>

    );
})
export default ProfileComponent
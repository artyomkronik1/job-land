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
    const { userid } = useParams();

    const [user, setuser] = useState<User>(userid ? UserStore.getUserInfoById(userid) : UserStore.user);

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
        comments: [],
        picture: '',

    });
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [usersPosts, setusersPosts] = useState([]);
    const [showPicturePopup, setshowPicturePopup] = useState(false);
    const [pictureToEdit, setpictureToEdit] = useState('');
    const [userToEdit, setuserToEdit] = useState<User>();

    const [isProfilePic, setisProfilePic] = useState(false);

    // update every 5 minutes the posts
    useEffect(() => {
        getPostByUserId();
    }, []);


    // edit profile
    const editProfile = () => {
        if (userid && userid === UserStore.user.id) {
            setopenPopup(true);
        }
        else if (!userid || userid.length == 0) {
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
        setshowPicturePopup(true)
        setpictureToEdit(pic)
        setuserToEdit(user)
        setisProfilePic(isProfile)
    }
    const closeeditPicture = () => {
        setshowPicturePopup(false)
        setpictureToEdit('')
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


            {showPicturePopup && (
                <PicturePopup isProfile={isProfilePic} onClose={closeeditPicture} picture={pictureToEdit} isOpen={showPicturePopup} user={userToEdit} />
            )}

            <div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
                <div style={{ marginTop: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >

                    <div style={{ position: 'relative', background: 'white', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', width: '100%', justifyContent: 'center' }} >



                        <img onClick={() => editPicture(user.backgroundPicture && user.backgroundPicture.length > 0 ? user.backgroundPicture : 'data:image/jpeg;base64,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', false)} src={user.backgroundPicture && user.backgroundPicture.length > 0 ? user.backgroundPicture : 'data:image/jpeg;base64,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'} style={{ display: 'flex', width: '100%', height: '250px', cursor: 'pointer' }} />

                        <div onClick={() => editPicture(user.profilePicture, true)} style={{ cursor: 'pointer', position: 'absolute', left: '65px', marginTop: '40px' }}><ProfileImage user={user} size="big" /></div>
                        <div style={{
                            position: 'relative', marginBottom: '30px',
                            height: '150px',
                            alignItems: 'end',

                            flexDirection: 'row', display: 'flex', width: '90%', justifyContent: 'space-between'
                        }}>


                            {user.id == UserStore.user.id && (

                                <div className={styles.editImg} style={{ width: '30px', right: '0px', top: '25px', height: '30px', position: 'absolute', display: 'flex', borderRadius: '50%', }}>
                                    <img onClick={editProfile} src={editImg} style={{ padding: '5px', cursor: 'pointer' }} />
                                </div>
                            )}


                            <div style={{ justifyContent: 'space-between', marginTop: '20px', display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                <div style={{ display: 'flex', maxWidth: '70%', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span className={styles.mainSpan} style={{ wordBreak: 'break-word', fontSize: '25px' }}>{user.name}</span>
                                    <span className={styles.mainSpan} style={{ maxHeight: '30px', width: '100%', overflow: 'hidden', wordBreak: 'break-word', fontSize: '18px' }}>{user.about}</span>
                                </div>

                                <div style={{ display: 'flex', width: '30%', flexDirection: 'column', gap: '5px', alignItems: 'end' }}>
                                    <span className={styles.mainSpan} style={{ maxHeight: '30px', wordBreak: 'break-word', display: 'flex', overflow: 'hidden', justifyContent: 'center', width: '50%', fontSize: '18px' }}>{user.experience}</span>
                                    <span className={styles.mainSpan} style={{ maxHeight: '30px', wordBreak: 'break-word', fontSize: '18px', overflow: 'hidden', justifyContent: 'center', width: '50%' }}>{user.education}</span>
                                </div>
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
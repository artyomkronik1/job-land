import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import React, { useContext, useEffect, useState } from "react";
import Login from "../login/login";
import componentStyles from './mainLayout.module.scss'
import styles from '../../assets/global-styles/styles.module.scss'
import globalStyles from "../../assets/global-styles/styles.module.scss";
import { useNavigate } from "react-router";
import editImg from '../../assets/images/edit.png'
import liked from '../../assets/images/liked.png'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import { Post } from "../../interfaces/post";
import StartPost from "../../dialogs/start-post/start-post";
import jobsStore from "../../store/job";
import { toast } from "react-toastify";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import like from '../../assets/images/like.png'
import PostsService from "../../services/postService";
import EditPost from "../../dialogs/edit-post/edit-post";
import PostComponen from "../post-component/post-componen";
const MainLayout = observer(() => {
    const [startIndex, setStartIndex] = useState(0);
    const navigate = useNavigate();
    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [posts, setPosts] = useState<Post[]>(jobsStore.followPost);
    const [openPopup, setopenPopup] = useState(false);
    const [editPost, setEditPost] = useState(false);
    const [goToProfileFlag, setgoToProfileFlag] = useState(false);
    const [likeFlag, setlike] = useState(false);

    const [editingPost, seteditingPost] = useState<Post>({
        likedBy: [],
        _id: "",
        title: "",
        description: "",
        employee_id: "",
        writer_name: "",
        comments: []
    });


    // update every 5 minutes the posts
    useEffect(() => {
        jobsStore.getAllPosts()
    }, []);
    // update every 5 minutes the posts
    useEffect(() => {
        setPosts(jobsStore.followPost)
    }, [likeFlag]);

    const openEditingPost = (event: any, post: Post) => {
        event.stopPropagation(); // Prevent the click from propagating to the outer container
        seteditingPost(post)
        setEditPost(true)
    }
    const closePopup = (success: boolean) => {
        if (success) {
            UserStore.setLoading(true);
            setTimeout(() => {
                UserStore.setLoading(false);
                toast.success(t('SUCCESS'));
                setopenPopup(false)
            }, 1000)
        }
        setEditPost(false)
        setopenPopup(false)
    }

    const startPost = () => {
        setopenPopup(true);
    }
    const goToNetwork = () => {
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            navigate('/network')
        }, 1000)
    }
    const changeLanguage = (lng: string) => {
        UserStore.setLanguage(lng)
        i18n.changeLanguage(lng);
    };


    const goToUserProfile = (event: any, name: string) => {
        event.stopPropagation(); // Prevent the click from propagating to the outer container

        event.preventDefault();
        setgoToProfileFlag(true)
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            navigate(`/profile/${name}`);
            UserStore.setTab("Profile")
        }, 1000)
    }

    const goToPost = (post: Post) => {
        if (!goToProfileFlag) {
            UserStore.setLoading(true);
            setTimeout(() => {
                UserStore.setLoading(false);
                navigate(`/posts/${post._id}`);
                UserStore.setTab("Home")
            }, 1000)
        }
    }

    const setLikeOnPost = (event: any, post: Post) => {

        event.stopPropagation();
        jobsStore.setLikeOnPost(post, UserStore.user.id, post.likedBy.includes(UserStore.user.id))
        setlike(!likeFlag)
    }
    return (
        <>

            {openPopup && (
                <StartPost isOpen={openPopup} onClose={closePopup} />
            )}
            {editPost && (
                <EditPost postForEdit={editingPost} isOpen={editPost} onClose={closePopup} />
            )}
            <div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', cursor: 'pointer', flexDirection: 'column', padding: '10px', marginTop: '50px', gap: '15px', alignSelf: 'center' }} className={globalStyles.basicForm}>
                            <div onClick={startPost} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ProfileImage user={UserStore.user} />
                                <div style={{ display: 'flex', justifyContent: 'start', padding: '10px 20px', borderRadius: '20px', border: '1px solid #a9acb1', backgroundColor: 'white', flex: '1 1 auto' }}>
                                    <span style={{ color: '#a9acb1', fontSize: '19px', fontWeight: 'bold' }}> {t('Start a post...')}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                <div style={{ display: 'flex', gap: '6px' }}> {t('Media')} <i style={{ color: 'red' }} className="fa-solid fa-image"></i> </div>
                                <div style={{ display: 'flex', gap: '6px', }}>  {t('Write article')} <i style={{ color: 'blue' }} className="fa fa-newspaper"></i></div>
                            </div>

                        </div>
                        {/*    posts*/}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className={globalStyles.separate_line_grey} style={{ width: '80%' }}> </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '80%', alignSelf: 'center' }}>

                            {posts.length > 0 ? posts.map((post: Post, index) => (
                                <PostComponen postId={post._id} gotToPostFlag={true} />)) : (

                                <div style={{ border: '1px solid #c3c4c5', backgroundColor: 'white', borderRadius: '20px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
                                    <span className={globalStyles.h2}>{'There is no posts...'}</span>
                                    <button onClick={() => goToNetwork()} className={globalStyles.btn}>{'Start follow'}</button>

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
})
export default MainLayout
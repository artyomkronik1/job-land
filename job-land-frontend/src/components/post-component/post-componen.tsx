import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import JobFilterBtn from "../../base-components/job-filter-btn/job-filter-btn";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import { Job, JobFilters } from "../../interfaces/job";
import componentStyles from "../MainLayout/mainLayout.module.scss";
import axios from "axios";
import { DropdownProps } from "../../interfaces/dropdown";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import jobsStore from "../../store/job";
import EditProfileDialog from "../../dialogs/edit-profile/edit-profile";
import { User } from "../../interfaces/user";
import JobPopup from "../../dialogs/job-popup/job-popup";
import jobService from "../../services/jobService";
import { useNavigate, useParams } from "react-router";
import editImg from "../../assets/images/edit.png";
import { Post } from "../../interfaces/post";
import EditPost from "../../dialogs/edit-post/edit-post";
import { toast } from "react-toastify";
import like from "../../assets/images/like.png";
import liked from "../../assets/images/liked.png";
import commentimg from '../../assets/images/comment.png'
import { comment } from '../../interfaces/comment'
import TextInputField from "../../base-components/text-input/text-input-field";
import { v4 as uuidv4 } from 'uuid';
import DropDown from "../../base-components/dropdown-component/dropdown";
import { UsersNotification } from "../../interfaces/usersNotification";
import DateService from "../../services/dateService";
import NotificationService from "../../services/notificationsService";
import LikesOnPostPopup from "../../dialogs/likes-on-post-popup/likes-on-post";
const PostComponent = observer((props: any) => {
    const [commentFlag, setcommentFlag] = useState(false);
    const [commentAdded, setcommentAdded] = useState(false);

    //language
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const postId = props.postId

    const [post, setPost] = useState<Post>(jobsStore.getPostInfoById(postId));
    const [likesCounter, setlikesCounter] = useState(0);
    const [commentsCounter, setcommentsCounter] = useState(post.comments.length);
    const [usersCommentOnPost, setusersCommentOnPost] = useState('');
    const [commentOptionsFlag, setcommentOptionsFlag] = useState('');
    const [editCommentFlag, seteditCommentFlag] = useState('');
    const [removeCommentFlag, setremoveCommentFlag] = useState(false);
    const [postSettings, setpostSettings] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setcommentOptionsFlag('');
                setpostSettings(false)
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const navigate = useNavigate();
    const [openLikesPopup, setopenLikesPopup] = useState(false);

    const [editPost, setEditPost] = useState(false);
    const [editingPost, seteditingPost] = useState<Post>({
        _id: "",
        title: "",
        picture: '',
        description: "",
        employee_id: "",
        writer_name: "",
        likedBy: [],
        comments: []
    });
    useEffect(() => {
        let count = 0;
        post.likedBy.forEach((like: string) => {
            if (like.length > 0) {
                count++;
            }
        })
        setlikesCounter(count)

    }, []);

    const openEditingPost = (event: any, post: Post) => {
        event.stopPropagation();
        seteditingPost(post)
        setEditPost(true)
    }
    const goToPost = (post: Post) => {
        if (props.gotToPostFlag) {
            UserStore.setLoading(true);
            setTimeout(() => {
                UserStore.setLoading(false);
                navigate(`/posts/${post._id}`);
                UserStore.setTab("Home")
            }, 1000)
        }
    }


    const goToUserProfile = (userid: string) => {
        UserStore.setLoading(true);
        setTimeout(() => {
            UserStore.setLoading(false);
            navigate(`/profile/${userid}`);
            UserStore.setTab("Profile")
        }, 1000)
    }
    const closePopup = (success: boolean) => {
        if (success) {
            UserStore.setLoading(true);
            setTimeout(() => {
                UserStore.setLoading(false);
                toast.success(t('SUCCESS'));
            }, 1000)
        }
        setopenLikesPopup(false)
        setEditPost(false)
    }


    const setLikeOnPost = useCallback(async (event: any, post: Post) => {
        event.stopPropagation();

        const isLiked = post.likedBy.includes(UserStore.user.id);
        setPost(await jobsStore.setLikeOnPost(post, UserStore.user.id, isLiked));
        setlikesCounter(post.likedBy.length)

        if (!isLiked) {
            let notification = {
                message: "liked your post",
                to: UserStore.getUserInfoById(post.employee_id).id,
                time: DateService.getCurrentDatetime(),
                link: post._id,
                from: UserStore.user.name,
                type: 'like'
            };
            if (post.likedBy.length - 1 > 0) {
                notification.message = "and " + (post.likedBy.length - 1) + " others liked your post"
            }

            await UserStore.makeNotifications(notification);

        }
        if (isLiked) {
            const noti = await UserStore.getSingleNot(UserStore.user.name, UserStore.getUserInfoById(post.employee_id).id, 'like', post._id)
            if (noti) {
                await UserStore.removeNotification(noti as UsersNotification)
            }
        }

    }, [postId]);
    // comments
    const commentOnPost = (event: any) => {
        event.stopPropagation();
        setcommentFlag(true)


    }
    const addComment = async (value: string) => {
        setusersCommentOnPost(value)

    }
    const postComment = async () => {
        setusersCommentOnPost('')
        const c: comment = { by: UserStore.user.id.toString(), text: usersCommentOnPost, id: uuidv4() }
        setPost(await jobsStore.addCommentOnPost(post, c))
        setcommentsCounter(post.comments.length);

        let notification = {
            message: "commented on your post",

            to: UserStore.getUserInfoById(post.employee_id).id,
            time: DateService.getCurrentDatetime(),
            link: post._id,
            from: UserStore.user.name,
            type: 'comment'
        };
        if (commentsCounter > 0) {
            notification.message = "and " + commentsCounter + " others commented on your post"
        }
        await UserStore.makeNotifications(notification);
    }
    const removePost = async (post: Post) => {
        UserStore.setLoading(true);
        setTimeout(async () => {
            await jobsStore.removePost(post)
            const nots: UsersNotification[] = await UserStore.getNotificationsByPostId(post._id)
            nots.forEach(async not => await NotificationService.removeNotifications(not))
            UserStore.setLoading(false);
            navigate(`/home`);
            UserStore.setTab("Home")
        }, 1000)
    }

    const editComment = (comment: comment) => {
        setcommentOptionsFlag('')
        seteditCommentFlag(comment.id)
        setPost(jobsStore.getPostInfoById(postId))

    }
    const removeComment = async (comment: comment) => {
        setcommentOptionsFlag('')
        setPost(await jobsStore.removeComment(post, comment))
        setcommentsCounter(post.comments.length);




    }
    const postUpdatedComment = (comment: comment) => {

        jobsStore.updateCommentForPost(post, comment)
        seteditCommentFlag('')
    }
    const openSettings = (event: any) => {
        event.stopPropagation();
        setpostSettings(true)
    }
    const openLikesOnPostPopup = (event: any) => {
        event.stopPropagation();
        setopenLikesPopup(true)

    }
    return (
        <>


            {editPost && (
                <EditPost postForEdit={editingPost} isOpen={editPost} onClose={closePopup} />
            )}

            {openLikesPopup && post.likedBy.length > 0 && (
                <LikesOnPostPopup post={post} isOpen={openLikesPopup} onClose={() => setopenLikesPopup(false)} />
            )}

            <div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >

                    <div className={componentStyles.postContainer} style={{ alignSelf: 'center', width: '100%' }} onClick={() => goToPost(post)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ cursor: 'pointer', width: '100%' }} className={componentStyles.postContainer__header} onClick={() => goToUserProfile(post.employee_id)}>
                                <ProfileImage user={UserStore.getUserInfoById(post.employee_id)} />
                                <div className={componentStyles.postContainer__header__details} style={{ width: '100%' }}>
                                    <span style={{ fontSize: '20px', color: '#1c1c39' }}> {post.writer_name}</span>
                                    <span style={{ color: '#717273', fontSize: '16px', fontWeight: 'normal', wordBreak: 'break-word', maxWidth: '80%', overflow: 'hidden' }} className={globalStyles.simpleP}> {UserStore.users.filter(user => user.id == post.employee_id)[0]?.about}</span>
                                </div>
                            </div>
                            {/* post settings */}
                            {UserStore.user.id == post.employee_id && (
                                <div style={{ position: 'relative', marginTop: '-15px' }}>
                                    <div onClick={(event) => openSettings(event)} style={{ cursor: 'pointer', fontSize: '35px', fontWeight: 'bolder', color: '#0a66c2' }}>
                                        ...

                                    </div>


                                    {postSettings && (
                                        <div style={{ position: 'absolute', left: '20px' }}>
                                            <div ref={dropdownRef} style={{ display: 'flex', flexDirection: 'column' }}>



                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginTop: '-30px' }} >

                                                    <ul className={componentStyles.dropdown}>
                                                        <div onClick={(event) => openEditingPost(event, post)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={componentStyles.dropdownOption}> <span>{t('edit')}</span></div>
                                                        <div onClick={() => removePost(post)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={componentStyles.dropdownOption}> <span>{t('remove')}</span></div>
                                                    </ul>

                                                </div>




                                            </div>
                                        </div>
                                    )}


                                </div>
                            )}
                        </div>

                        <div className={componentStyles.postContainer__main}>
                            {/*<span  style={{  fontSize:'19px',display:'flex', color:'#555555',  wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {post.title}</span>*/}

                            {post.picture && post.picture.length > 0 && (
                                <div style={{ width: '100%' }}>
                                    <img src={post.picture} style={{ width: '100%' }} />
                                </div>
                            )}
                            <span style={{ display: 'flex', color: '#181818', fontSize: '22px', fontWeight: 'normal', wordBreak: 'break-all', width: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}> {post.description}</span>

                        </div>

                        <div onClick={(event) => event.stopPropagation()} style={{ padding: '15px', marginTop: '20px', marginBottom: '-20px', width: '97%', display: 'flex', justifyContent: 'space-between' }}>
                            {/*<span  style={{  fontSize:'19px',display:'flex', color:'#555555',  wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {post.title}</span>*/}
                            <span style={{ cursor: 'pointer', display: 'flex', color: 'rgb(113, 114, 115)', fontSize: '16px', fontWeight: 'normal', }} onClick={(event) => openLikesOnPostPopup(event)} > {likesCounter + t(' liked this post')}</span>
                            <span onClick={() => setcommentFlag(true)} style={{ cursor: 'pointer', display: 'flex', color: 'rgb(113, 114, 115)', fontSize: '16px', fontWeight: 'normal' }}> {commentsCounter + t(' comments')}</span>

                        </div>

                        <div className={globalStyles.separate_line_grey}> </div>
                        <div style={{ display: 'flex', justifyContent: 'start', width: '100%', padding: '10px', gap: '20px' }}>
                            {/*    like*/}
                            {!post.likedBy?.includes(UserStore.user.id) && (
                                <div className={componentStyles.editImg} onClick={(event) => setLikeOnPost(event, post)}>
                                    <i style={{ cursor: 'pointer', color: 'rgb(113, 114, 115)', fontSize: '30px' }} className="fa-regular fa-thumbs-up"></i>
                                </div>
                            )}
                            {post.likedBy?.includes(UserStore.user.id) && (
                                <div className={componentStyles.editImg} onClick={(event) => setLikeOnPost(event, post)} >
                                    <i style={{ cursor: 'pointer', color: '#0a66c2', fontSize: '30px' }} className="fa fa-light fa-thumbs-up"></i>
                                    {/* <img src={liked} style={{ cursor: 'pointer', width: '30px' }} /> */}
                                </div>
                            )}
                            <div className={componentStyles.editImg} onClick={(event) => commentOnPost(event)}>

                                <i style={{ cursor: 'pointer', color: 'rgb(113, 114, 115)', fontSize: '30px' }} className="fa-regular fa-comment-dots"></i>
                            </div>
                        </div>
                        {/*comment div*/}
                        {commentFlag && (
                            <div onClick={(event) => event.stopPropagation()}>
                                {/*    users comments*/}
                                <div style={{ marginTop: '30px', background: 'white', display: 'flex', width: '100%', justifyContent: 'start', gap: '10px', alignItems: 'center' }}>
                                    <ProfileImage user={UserStore.user} />
                                    <div style={{ width: '70%', display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px' }}>
                                        <div >
                                            <TextInputField size={'small'} background={'grey'} type={'text'} placeHolder={t('Add a comment')} text={t('')} value={usersCommentOnPost} onChange={addComment} />
                                        </div>
                                        {usersCommentOnPost.length > 0 && (
                                            <div>
                                                <button className={globalStyles.btn} onClick={postComment} style={{ marginTop: '5px', width: '70px', height: '40px', }}> {t('post')}</button>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* All comments */}
                                {post.comments.length > 0 && (
                                    <div style={{ marginTop: '20px', maxHeight: '350px', overflowY: 'scroll' }}>
                                        {post.comments.map((comment: comment, index) => (
                                            <div key={index} style={{ display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '50px' }}>
                                                <ProfileImage user={UserStore.getUserInfoById(comment.by)} />
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '500px' }}>
                                                    <div className={componentStyles.postContainer__header__details} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '25px', padding: '10px', background: '#dfdfe0' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                                            <span style={{ fontSize: '20px', color: '#1c1c39' }}> {UserStore.getUserInfoById(comment.by).name}</span>
                                                            <span style={{ color: '#717273', fontSize: '16px', fontWeight: 'normal', wordBreak: 'break-word' }} className={globalStyles.simpleP}> {UserStore.getUserInfoById(comment.by).about}</span>
                                                            {editCommentFlag == comment.id ? (
                                                                <div style={{ display: 'flex', }}>

                                                                    <TextInputField background={'grey'} type={'text'} size={'small'} placeHolder={t('Add a comment')} text={t('')} value={comment.text} onChange={(value: string) => comment.text = value} />
                                                                    <button className={globalStyles.btn} onClick={() => postUpdatedComment(comment)} style={{ marginTop: '5px', width: '200px', height: '40px', }}> {t('save changes')}</button>
                                                                </div>
                                                            ) : <span style={{ marginTop: '10px', fontSize: '20px', color: '#1c1c39' }}> {comment.text}</span>
                                                            }
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>

                                                            {/* close editing comment */}
                                                            {editCommentFlag == comment.id && (<div onClick={() => seteditCommentFlag('')} style={{ display: 'flex', marginTop: '-10px', justifyContent: 'end', cursor: 'pointer', fontSize: '25px' }}>x</div>
                                                            )}
                                                            {/* 3 points to open setiing of comment */}
                                                            {editCommentFlag == '' && (<div onClick={() => setcommentOptionsFlag(comment.id)} style={{ display: 'flex', justifyContent: 'end', marginTop: '-25px', cursor: 'pointer', fontSize: '35px' }}>...</div>
                                                            )}
                                                            {commentOptionsFlag === comment.id && comment.by === UserStore.user.id ? (
                                                                <div style={{ position: 'relative' }}>
                                                                    <div ref={dropdownRef} style={{ display: 'flex', flexDirection: 'column' }}>



                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginTop: '-20px' }} >

                                                                            <ul className={componentStyles.dropdown}>
                                                                                <div onClick={() => editComment(comment)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={componentStyles.dropdownOption}> <span>{t('edit')}</span></div>
                                                                                <div onClick={() => removeComment(comment)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={componentStyles.dropdownOption}> <span>{t('remove')}</span></div>
                                                                            </ul>

                                                                        </div>




                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        )}

                    </div>
                </div>

            </div>
        </>

    );
})
export default PostComponent
import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import React, { useContext, useEffect, useRef, useState } from "react";
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
const PostComponent = observer((props: any) => {
    const [likeFlag, setlike] = useState(false);
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

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setcommentOptionsFlag('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const navigate = useNavigate();
    const [editPost, setEditPost] = useState(false);
    const [editingPost, seteditingPost] = useState<Post>({
        _id: "",
        title: "",
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

    useEffect(() => {
        setPost(jobsStore.getPostInfoById(postId))
    }, [editPost]);
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
        setEditPost(false)
    }
    // likes
    useEffect(() => {
        setPost(jobsStore.getPostInfoById(postId))
    }, [likeFlag]);
    const setLikeOnPost = (event: any, post: Post) => {
        event.stopPropagation();
        jobsStore.setLikeOnPost(post, UserStore.user.id, post.likedBy.includes(UserStore.user.id))
        setlike(!likeFlag)
    }
    // comments
    const commentOnPost = (event: any) => {
        event.stopPropagation();
        setcommentFlag(true)

    }
    const addComment = (value: string) => {
        setusersCommentOnPost(value)
    }
    const postComment = () => {
        setusersCommentOnPost('')

        const c: comment = { by: UserStore.user.id.toString(), text: usersCommentOnPost, id: uuidv4() }
        jobsStore.addCommentOnPost(post, c)
        setcommentAdded(true)

    }
    useEffect(() => {
        setPost(jobsStore.getPostInfoById(postId))
        setcommentsCounter(post.comments.length)
        setcommentAdded(false)
    }, [commentAdded, editCommentFlag, removeCommentFlag]);

    const editComment = (comment: comment) => {
        setcommentOptionsFlag('')
        seteditCommentFlag(comment.id)
    }
    const removeComment = (comment: comment) => {
        setcommentOptionsFlag('')
        jobsStore.removeComment(post, comment)
        setremoveCommentFlag(!removeCommentFlag)

    }
    const postUpdatedComment = (comment: comment) => {

        jobsStore.updateCommentForPost(post, comment)
        seteditCommentFlag('')
    }
    const getSettingAction = (val: string) => {
        if (val == 'Edit') {

        }
        if (val == 'Remove') {

        }

    }
    return (
        <>


            {editPost && (
                <EditPost postForEdit={editingPost} isOpen={editPost} onClose={closePopup} />
            )}

            <div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >

                    <div className={componentStyles.postContainer} style={{ alignSelf: 'center', width: '100%' }} onClick={() => goToPost(post)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <div className={componentStyles.postContainer__header} onClick={() => goToUserProfile(post.employee_id)}>
                                <ProfileImage user={UserStore.getUserInfoById(post.employee_id)} />
                                <div className={componentStyles.postContainer__header__details}>
                                    <span style={{ fontSize: '20px', color: '#1c1c39' }}> {post.writer_name}</span>
                                    <span style={{ color: '#717273', fontSize: '16px', fontWeight: 'normal', wordBreak: 'break-word' }} className={globalStyles.simpleP}> {UserStore.users.filter(user => user.id == post.employee_id)[0]?.about}</span>
                                </div>
                            </div>
                            {UserStore.user.id == post.employee_id && (
                                <div style={{ width: '30px', height: '30px', display: 'flex', borderRadius: '50%', border: '1px solid black' }}>
                                    <img onClick={(event) => openEditingPost(event, post)} src={editImg} style={{ padding: '5px', cursor: 'pointer' }} />
                                </div>
                            )}
                        </div>

                        <div className={componentStyles.postContainer__main}>
                            {/*<span  style={{  fontSize:'19px',display:'flex', color:'#555555',  wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {post.title}</span>*/}
                            <span style={{ display: 'flex', color: '#181818', fontSize: '22px', fontWeight: 'normal', wordBreak: 'break-all', width: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}> {post.description}</span>

                        </div>

                        <div onClick={(event) => event.stopPropagation()} style={{ padding: '15px', marginTop: '20px', marginBottom: '-20px', width: '97%', display: 'flex', justifyContent: 'space-between' }}>
                            {/*<span  style={{  fontSize:'19px',display:'flex', color:'#555555',  wordBreak: 'break-all', width:'100%', maxWidth:'100%', maxHeight:'100%',overflow:'hidden'}}> {post.title}</span>*/}
                            <span style={{ display: 'flex', color: '#717273', fontSize: '16px', fontWeight: 'normal', }}> {likesCounter + t(' liked this post')}</span>
                            <span onClick={() => setcommentFlag(true)} style={{ cursor: 'pointer', display: 'flex', color: '#717273', fontSize: '16px', fontWeight: 'normal' }}> {commentsCounter + t(' comments')}</span>

                        </div>

                        <div className={globalStyles.separate_line_grey}> </div>
                        <div style={{ display: 'flex', justifyContent: 'start', width: '100%', padding: '10px', gap: '20px' }}>
                            {/*    like*/}
                            {!post.likedBy?.includes(UserStore.user.id) && (
                                <img onClick={(event) => setLikeOnPost(event, post)} src={like} style={{ cursor: 'pointer', width: '30px' }} />
                            )}
                            {post.likedBy?.includes(UserStore.user.id) && (
                                <img onClick={(event) => setLikeOnPost(event, post)} src={liked} style={{ cursor: 'pointer', width: '30px' }} />
                            )}
                            <img onClick={(event) => commentOnPost(event)} src={commentimg} style={{ cursor: 'pointer', width: '30px' }} />
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
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '450px' }}>
                                                    <div className={componentStyles.postContainer__header__details} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '25px', padding: '10px', background: '#dfdfe0' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                                            <span style={{ fontSize: '20px', color: '#1c1c39' }}> {UserStore.getUserInfoById(comment.by).name}</span>
                                                            <span style={{ color: '#717273', fontSize: '16px', fontWeight: 'normal' }} className={globalStyles.simpleP}> {UserStore.getUserInfoById(comment.by).about}</span>
                                                            {editCommentFlag == comment.id ? (
                                                                <div style={{ display: 'flex', gap: '20px' }}>

                                                                    <TextInputField background={'grey'} type={'text'} size={'small'} placeHolder={t('Add a comment')} text={t('')} value={comment.text} onChange={(value: string) => comment.text = value} />
                                                                    <button className={globalStyles.btn} onClick={() => postUpdatedComment(comment)} style={{ marginTop: '5px', width: '150px', height: '40px', }}> {t('save changes')}</button>
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
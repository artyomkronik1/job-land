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
import PostComponent from "../post-component/post-componen";
import PicturePopup from "../../dialogs/picturePopup/picture-popup";
import { Company } from "../../interfaces/company";
const CompanyComponent = observer(() => {
	// params
	const { companyId = '' } = useParams();


	const navigate = useNavigate();
	const [openPopup, setopenPopup] = useState(false);

	//language
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const [usersPosts, setusersPosts] = useState([]);
	const [showPicturePopup, setshowPicturePopup] = useState(false);
	const [pictureToEdit, setpictureToEdit] = useState('');
	const [userToEdit, setuserToEdit] = useState<User>();

	const [isProfilePic, setisProfilePic] = useState(false);



	// const getPostByUserId = async () => {
	// 	try {
	// 		//sent
	// 		const allPostsByUser = await postService.getPostByUserId(user);
	// 		if (allPostsByUser.data.success) {
	// 			setusersPosts(allPostsByUser.data.posts)
	// 		}
	// 	} catch (error) {
	// 		console.error('Error getting users messages', error);
	// 	}
	// }
	// const editPicture = (pic: string, isProfile: boolean) => {
	// 	setshowPicturePopup(true)
	// 	setpictureToEdit(pic)
	// 	setuserToEdit(user)
	// 	setisProfilePic(isProfile)
	// }
	const closeeditPicture = () => {
		setshowPicturePopup(false)
		setpictureToEdit('')
		setisProfilePic(false)
	}
	return (
		<>

			{/* {openPopup && (user && user.name.length > 0) && (
				<EditProfileDialog isOpen={openPopup} onClose={closeEditProfilePopup} profileForEdit={user} />
			)} */}





			{showPicturePopup && (
				<PicturePopup isProfile={isProfilePic} onClose={closeeditPicture} picture={pictureToEdit} isOpen={showPicturePopup} user={userToEdit} />
			)}

			<div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
				{companyId && (
					<div style={{ marginTop: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >

						<div style={{ position: 'relative', background: 'white', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', width: '100%', justifyContent: 'center' }} >


							<img style={{ display: 'flex', width: '100%', height: '250px', cursor: 'pointer' }}
								src={jobsStore.getCompanyInfoByCompanyId(companyId).backgroundPicture.length > 0 ? jobsStore.getCompanyInfoByCompanyId(companyId).backgroundPicture : ''} />
							<div style={{ cursor: 'pointer', position: 'absolute', left: '65px', marginTop: '0px' }}></div>
							<div style={{
								position: 'relative', marginBottom: '120px',
								alignItems: 'end',

								flexDirection: 'row', display: 'flex', width: '90%', justifyContent: 'space-between'
							}}>





								<div style={{ justifyContent: 'space-between', marginTop: '-30px', display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'flex-start' }}>
									<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
										<ProfileImage user={jobsStore.getCompanyInfoByCompanyId(companyId)} />

										<span className={styles.mainSpan} style={{ wordBreak: 'break-word', fontSize: '25px' }}>{jobsStore.getCompanyInfoByCompanyId(companyId).name}</span>
										<span className={styles.mainSpan} style={{ color: 'rgb(113, 114, 115)' }}>{jobsStore.getCompanyInfoByCompanyId(companyId).about}</span>

									</div>



								</div>

							</div>
						</div>
						{/*separate line*/}
						<div style={{ width: '100%' }} className={globalStyles.separate_line_grey}> </div>
						{/*  users posts*/}
						{usersPosts.length > 0 ? (
							<div style={{ display: 'flex', flexDirection: 'column', width: '99%' }}>

								{usersPosts.map((post: Post, index) => (

									<PostComponent postId={post._id} />

								))}
							</div>) :
							<span style={{ marginTop: '20px', fontSize: '26px' }} className={globalStyles.mainSpan}>{t('There is no posts')}</span>
						}

					</div>
				)}


			</div >
		</>

	);
})
export default CompanyComponent
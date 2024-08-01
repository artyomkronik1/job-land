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
import { Chat } from "../../interfaces/chat";
import EditJob from "../../dialogs/edit-job/edit-job";
const JobComponent = observer((props: any) => {

	//language
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const [postSettings, setpostSettings] = useState(false);

	const [job, setJob] = useState<Job>(props.job);
	const navigate = useNavigate();
	const [editPost, setEditPost] = useState(false);
	const [apply, setapply] = useState(false);

	const [editingPost, seteditingPost] = useState<Job>({
		id: "",
		title: "",
		description: "",
		salary: 0,
		hire_name: "",
		company_name: "",
		hire_manager_id: "",
		zone: "",
		profession: "",
		region: "",
		manner: "",
		experienced_level: "",
		scope: "",
		applications: []
	});
	const goToHrProfile = (userid: string) => {
		UserStore.setLoading(true);
		setTimeout(() => {
			UserStore.setLoading(false);
			navigate(`/profile/${userid}`);
			UserStore.setTab("Profile")
		}, 1000)
	}
	const MessageToUser = (id: string) => {

		const c = UserStore.chats.find((chat: Chat) => chat.messages[0].receiver == id || chat.messages[0].sender == id)
		if (c) {
			UserStore.setCurrentChat(c as Chat)
		}
		else {
			UserStore.setnewUserToChat(id)

		}

	}
	const openSettings = (event: any) => {
		event.stopPropagation();
		setpostSettings(true)
	}
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setpostSettings(false)
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	const openEditingPost = (post: Job) => {
		seteditingPost(post)
		setEditPost(true)
	}
	const closePopup = (success: boolean) => {
		// if (success) {
		// 	UserStore.setLoading(true);
		// 	setTimeout(() => {
		// 		UserStore.setLoading(false);
		// 		toast.success(t('SUCCESS'));
		// 	}, 1000)
		// }
		setEditPost(false)
		setapply(false);
	}

	const removePost = async (post: Job) => {
		await jobsStore.removejob(post)

		UserStore.setLoading(true);
		setTimeout(() => {
			UserStore.setLoading(false);
			toast.success(t('SUCCESS'));
		}, 1000)
		await jobsStore.getALlJobs();
	}
	const openApplyDialog = (j: Job) => {
		seteditingPost(j)
		setapply(true)
	}

	return (
		<>
			{apply ? (
				<JobPopup isOpen={apply} onClose={closePopup} children={editingPost} />
			) : null}
			{editPost && (
				<EditJob children={editingPost} isOpen={editPost} onClose={closePopup} />
			)}


			<div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
				<div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >

					<div className={componentStyles.postContainer} style={{ alignSelf: 'center', width: '100%', }}  >
						{/* header */}
						<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginInlineStart: '20px' }}>
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
								<ProfileImage user={jobsStore.getCompanyInfoByCompanyName(job.company_name)} />
								<span style={{ color: 'rgb(113, 114, 115)', fontSize: '18px' }}>{job.company_name}</span>
							</div>
							<div style={{ marginInlineEnd: '20px' }}>
								{UserStore.user.id == job.hire_manager_id && (
									<div style={{ position: 'relative', marginTop: '-15px' }}>
										<div onClick={(event) => openSettings(event)} style={{ cursor: 'pointer', fontSize: '35px', fontWeight: 'bolder', color: '#0a66c2' }}>
											...

										</div>


										{postSettings && (
											<div style={{ position: 'absolute', left: '20px' }}>
												<div ref={dropdownRef} style={{ display: 'flex', flexDirection: 'column' }}>



													<div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginTop: '-30px' }} >

														<ul className={componentStyles.dropdown}>
															<div onClick={() => openEditingPost(job)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={componentStyles.dropdownOption}> <span>{t('edit')}</span></div>
															<div onClick={() => removePost(job)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={componentStyles.dropdownOption}> <span>{t('remove')}</span></div>
														</ul>

													</div>




												</div>
											</div>
										)}


									</div>
								)}
							</div>

						</div>
						<div style={{ display: 'flex', justifyContent: 'start', width: '100%', marginTop: '10px', marginInlineStart: '20px' }}>
							<span style={{ color: 'rgb(24, 24, 24)', fontSize: '25px' }}>{job.title}</span>

						</div>
						<div style={{ display: 'flex', justifyContent: 'start', width: '100%', marginTop: '10px', gap: '10px', marginInlineStart: '20px' }}>
							<span style={{ color: 'rgb(113, 114, 115)', fontSize: '14px' }}>{job.region + ","}</span>
							<span style={{ color: 'rgb(113, 114, 115)', fontSize: '14px' }}>{job.applications.length + t(' applicatns')}</span>

						</div>
						<div style={{ display: 'flex', justifyContent: 'start', width: '100%', marginTop: '10px', gap: '10px', marginInlineStart: '20px' }}>
							<i className="fa fa-briefcase"></i>
							<span style={{ color: 'rgb(113, 114, 115)', fontSize: '14px' }}>{job.manner + ","}</span>

							<span style={{ color: 'rgb(113, 114, 115)', fontSize: '14px' }}>{job.scope}</span>

						</div>
						{!job.applications.includes(UserStore.user.id) ? (
							<div style={{ display: 'flex', justifyContent: 'start', width: '100%', marginTop: '20px', marginBottom: '20px', marginInlineStart: '20px' }}>
								<button onClick={() => openApplyDialog(job)} style={{ width: '100px' }} className={globalStyles.btn}>{t('Apply')}</button>
							</div>
						)
							:
							<div style={{ alignItems: 'center', gap: '5px', color: 'green', display: 'flex', justifyContent: 'start', marginInlineStart: '20px', marginTop: '20px', marginBottom: '20px' }}>
								<i className="fa fa-check-circle" aria-hidden="true"></i>

								<span>
									{t('Already applied')}
								</span>
							</div>
						}
						<div style={{ margin: '10px', padding: '10px', borderRadius: '25px', border: '1px solid rgb(113, 114, 115)', display: 'flex', marginTop: '20px', gap: '10px', flexDirection: 'column' }}>
							<span style={{ fontSize: '18px', color: 'rgb(24, 24, 24)', justifyContent: 'start', display: 'flex' }}>{t('Meet the hiring team')}</span>
							<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
								<div style={{ display: 'flex', width: '100%', gap: '7px' }} onClick={() => goToHrProfile(job.hire_manager_id)}>
									<ProfileImage size="icon" user={UserStore.getUserInfoById(job.hire_manager_id)} />
									<div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'start', justifyContent: 'center' }}>
										<span style={{ fontSize: '14px' }}>{job.hire_name}</span>
										<span style={{ color: 'rgb(113, 114, 115)', fontSize: '14px' }}>{UserStore.getUserInfoById(job.hire_manager_id)?.about}</span>

									</div>
								</div>
								{UserStore.user.id != job.hire_manager_id && (
									<button onClick={() => MessageToUser(job.hire_manager_id)} style={{ width: '15vh', display: 'flex', gap: '8px', height: '35px', alignItems: 'center', fontSize: '18px', color: 'rgb(113, 114, 115)', borderRadius: '25px', border: '1px solid rgb(113, 114, 115)', background: 'white', cursor: 'pointer' }}>
										<i style={{ fontSize: '17px' }} className="fa-regular fa-message" aria-hidden="true"></i>
										<span style={{ fontSize: '16px' }}> {t('Message')}</span>
									</button>
								)}

							</div>
						</div>
						<div style={{
							flexDirection: 'column', gap: "5px",
							alignItems: 'start',
							display: 'flex', width: '100%', marginInlineStart: '20px', marginTop: '20px'
						}}>
							< span style={{ fontSize: '18px', color: 'rgb(24, 24, 24)', justifyContent: 'start', display: 'flex' }}>{t('About the job')}</span>
							<span>{job.description}</span>
						</div>
					</div>
				</div >

			</div >
		</>

	);
})
export default JobComponent
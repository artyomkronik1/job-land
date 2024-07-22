import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "../../interfaces/user";
import { Post } from "../../interfaces/post";
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import globalStyles from "../../assets/global-styles/styles.module.scss";
import { toast } from "react-toastify";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import globals from "../../assets/global-styles/styles.module.scss";
import { Chat } from "../../interfaces/chat";
const NotificationComponent = observer(() => {
	const navigate = useNavigate();
	//language
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	// loading users
	// useEffect(() => {
	// 	UserStore.makeNotifications({
	// 		message: 'string',
	// 		to: 'string',
	// 		time: 'string',
	// 	});
	// }, [])

	// set users and connections by search value input

	return (
		<>
			<ToastComponent />
			<div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
				<div style={{ marginTop: '90px', display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%', flexWrap: 'wrap' }} >
					<span>{t('notifications')}</span>
				</div>
			</div>
		</>

	);
})
export default NotificationComponent
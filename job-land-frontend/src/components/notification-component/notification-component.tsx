import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import UserStore from "../../store/user";
import ToastComponent from "../../base-components/toaster/ToastComponent";

import styles from "./notification.module.scss";
import { UsersNotification } from "../../interfaces/usersNotification";
import globals from "../../assets/global-styles/styles.module.scss";

const NotificationComponent = observer(() => {
	const navigate = useNavigate();

	// Language translation
	const { t } = useTranslation();

	// State to hold notifications from UserStore
	const [notifications, setNotifications] = useState<UsersNotification[]>([]);

	// useCallback to memoize the fetchNotifications function
	const fetchNotifications = useCallback(async () => {
		try {
			await UserStore.getUsersNotifications(UserStore.user.id); // Assuming getUsersNotifications is async
			setNotifications([...UserStore.notifications].reverse());
		} catch (error) {
			console.error("Error fetching notifications:", error);
		}
	}, []); // No dependencies means this function never changes

	// Effect to fetch notifications from UserStore on component mount
	useEffect(() => {
		fetchNotifications(); // Call the fetchNotifications callback
	}, [fetchNotifications]);

	const getRelativeDateString = (timestamp: string): string => {
		const date = new Date(timestamp);
		const currentDate = new Date();

		// Helper function to format time
		const formatTime = (date: Date): string => {
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			return `${hours}:${minutes}`;
		};

		// Check if the date is today
		if (date.toDateString() === currentDate.toDateString()) {
			return `${t('Today')}  ${formatTime(date)}`;
		}

		// Calculate yesterday's date
		const yesterday = new Date(currentDate);
		yesterday.setDate(currentDate.getDate() - 1);

		// Check if the date is yesterday
		if (date.toDateString() === yesterday.toDateString()) {
			return `${t('Yesterday')}  ${formatTime(date)}`;
		}

		// Check if the date is within the current week

		const daysOfWeek = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday')];
		const dayOfWeek = daysOfWeek[date.getDay()];

		// Check if the date is within the current month
		const monthNames = [
			t('January'), t('February'), t('March'), t('April'), t('May'), t('June'),
			t('July'), t('August'), t('September'), t('October'), t('November'), t('December')
		];


		const monthName = monthNames[date.getMonth()];
		const dayOfMonth = date.getDate();

		// Check if the date is within the current year
		const year = date.getFullYear();
		const currentYear = currentDate.getFullYear();

		// Format for dates within the same year
		if (year === currentYear) {
			return `${dayOfWeek} ${formatTime(date)}`;
		} else {
			return `${monthName} ${dayOfMonth}, ${year} ${formatTime(date)}`;
		}
	};

	const goToPost = (postid: string) => {
		UserStore.setLoading(true);
		setTimeout(() => {
			UserStore.setLoading(false);
			navigate(`/posts/${postid}`);
			UserStore.setTab("Home")
		}, 1000)

	}
	const clickOnNotification = (notification: UsersNotification) => {
		// notification about users post
		if ((notification.type && notification.link && notification.type == "like") || (notification.type && notification.link && notification.type == "new_post") || (notification.type && notification.link && notification.type == "comment")) {
			goToPost(notification.link)
		}
	}


	return (
		<>
			<ToastComponent />
			<div dir={UserStore.getLanguage() === "en" ? "ltr" : "rtl"}>
				<div style={{ marginTop: "90px", display: "flex", flexDirection: "column", alignItems: "center", width: "70%", flexWrap: "wrap" }}>
					{notifications && notifications.length > 0 &&
						notifications.map((not: UsersNotification, index: number) => (
							<>
								<div key={index} className={styles.notContainer} onClick={() => clickOnNotification(not)}>
									<div style={{ display: 'flex', gap: '5px' }}>
										<span className={globals.mainSpan}>{t(not.from)} </span>
										<span style={{ fontWeight: 'normal' }} className={globals.mainSpan}>{t(not.message)} </span>
									</div>
									<span className={globals.mainSpan}>	{getRelativeDateString(not.time)} </span>
								</div>

								<div style={{ marginBottom: '20px' }} className={globals.separate_line_grey}></div>
							</>
						))}
				</div>
			</div>
		</>
	);
});

export default NotificationComponent;

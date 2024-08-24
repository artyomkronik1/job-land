import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './likes-on-post.module.scss';
import globalStyles from '../../assets/global-styles/styles.module.scss';
import ProfileImage from '../../base-components/profile-image/profile-image-component';
import { useTranslation } from 'react-i18next';
import Popup from '../../base-components/popup/popup-component';
import ToastComponent from '../../base-components/toaster/ToastComponent';

import { Post } from '../../interfaces/post';
import userStore from '../../store/user';
import { User } from '../../interfaces/user';
import { useNavigate } from 'react-router';

export interface LikesOnPostPopupProps {
	isOpen: boolean;
	onClose: (success: boolean) => void;
	post: Post;
}

const LikesOnPostPopup = (props: LikesOnPostPopupProps) => {
	const [users, setUsers] = useState<User[]>([]);

	const dialogRef = useRef<HTMLDivElement>(null);
	//console.log(props.post);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
				props.onClose(true);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const { t } = useTranslation();
	const navigate = useNavigate();


	useEffect(() => {
		const fetchUsers = async () => {
			try {
				// Fetch users concurrently
				let localusers: User[] = []
				props.post.likedBy.map(async (userId) => {

					const user = userStore.users.find(user => user.id == userId)
					if (user) {
						localusers.push(user)
					}
				});

				setUsers(localusers)
			} catch (error) {
				console.error('Failed to fetch users', error);
			}
		};

		fetchUsers();
	}, [props.post.likedBy]);

	const goToUserProfile = (name: string) => {
		userStore.setLoading(true);
		setTimeout(() => {
			userStore.setLoading(false);
			navigate(`/profile/${name}`);
			userStore.setTab("Profile")
		}, 1000)
	}


	return (
		<>
			<Popup popupTitle="Likes" width="50vh" onClose={() => props.onClose(true)}>
				<ToastComponent />
				<div ref={dialogRef} className={styles.main} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
					{users.length > 0 ? (
						users.map((user) => (
							<div key={user.id} style={{ display: 'flex', gap: '10px' }}>
								<div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
									<div style={{ display: 'flex', gap: '10px', cursor: 'pointer' }} onClick={() => goToUserProfile(user.id)} >
										<ProfileImage user={user} />
										<div style={{ display: 'flex', flexDirection: 'column' }}>
											<span style={{ fontWeight: 'bold', fontSize: '15px', color: 'rgb(64, 65, 65)' }}>{user.name}</span>
											<span style={{ color: 'rgb(113, 114, 115)' }}>{user.about}</span>
										</div>
									</div>
									<div className={globalStyles.separate_line_grey}></div>
								</div>

							</div>
						))
					) : (
						<p>No likes yet</p> // Optionally, show a message if no users are found
					)}
				</div>
			</Popup>
		</>
	);
};

export default LikesOnPostPopup;

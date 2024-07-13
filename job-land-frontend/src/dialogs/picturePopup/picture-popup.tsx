import React, { ReactNode, useEffect, useRef, useState } from 'react';
import UserStore from "../../store/user";
import styles from './picture-popup.module.scss'
import globalStyles from '../../assets/global-styles/styles.module.scss'
import ProfileImage from "../../base-components/profile-image/profile-image-component";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Popup from "../../base-components/popup/popup-component";
import WarningPopup from "../../base-components/warning-popyp/warning-popup";
import ToastComponent from "../../base-components/toaster/ToastComponent";
import jobsStore from "../../store/job";
import TextInputField from "../../base-components/text-input/text-input-field";
import addPhoto from '../../assets/images/addPhoto.png';
import d from '../../assets/images/delete.png'
import globalstyles from "../../assets/global-styles/styles.module.scss";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import stylesProfilePioc from '../../base-components/profile-image/profile-image.module.scss'
import { set } from 'mobx';
import { User } from '../../interfaces/user';
export interface PicturePopupProps {
	isOpen: boolean;
	onClose: (success: boolean) => void;
	children?: ReactNode;
	picture: string
	isProfile: boolean
	user?: User;
}

const PicturePopup = (props: PicturePopupProps) => {
	const dialogRef = useRef<HTMLDivElement>(null);
	// Language
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const [updatedPicture, setupdatedPicture] = useState(props.picture);


	const getColorByLetter = (letter: string) => {
		const colorOptions = [
			{ letters: ['A', 'B', 'C'], color: '#FF5733' },
			{ letters: ['D', 'E', 'F'], color: '#33FF57' },
			{ letters: ['G', 'H', 'I'], color: '#5733FF' },
			{ letters: ['J', 'K', 'L'], color: '#229bdc' },
			{ letters: ['M', 'N', 'O'], color: '#dcd922' },
			{ letters: ['P', 'Q', 'R'], color: '#f87e96' },
			{ letters: ['S', 'T', 'U'], color: '#7ef8c5' },
			{ letters: ['V', 'W'], color: '#9355f5' },
			{ letters: ['Y', 'Z'], color: '#a81616' },
			// Define more color options for other letters
		];
		const selectedOption = colorOptions.find(option => option.letters.includes(letter?.toUpperCase()));
		return selectedOption ? selectedOption.color : '#808080'; // Default color
	}
	const getbackgroundColor = () => {
		if (props && props.user) {
			let first_name = ""
			const spaceIndex = props.user.name?.indexOf(" "); // Find the index of the space
			if (spaceIndex != -1) {
				first_name = props.user.name?.substring(0, spaceIndex);
				return getColorByLetter(first_name[0]);
			} else {
				return getColorByLetter(props.user.name[0]);
			}
		}
	}

	const initials = () => {
		if (props && props.user) {
			const spaceIndex = props.user.name.indexOf(" "); // Find the index of the space
			if (spaceIndex != -1) {
				const first_name = props.user.name.substring(0, spaceIndex);
				const last_name = props.user.name.substring(spaceIndex + 1);
				return first_name[0] + last_name[0];
			}
			else {
				return props.user.name[0]
			}
		}
	}
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
				closeDialog();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);


	const closeDialog = () => {

		closeFinalyDialog(true);

	};

	const closeFinalyDialog = (success: boolean) => {
		props.onClose(true);
	};

	const handleBackgroundPicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const storageRef = firebase.storage().ref()
			const fileRef = storageRef.child(file.name)
			fileRef.put(file).then((snapchot) => {
				snapchot.ref.getDownloadURL()
					.then((downloadURL) => {
						console.log(downloadURL)
						uploadPic(downloadURL);
						//setImgUrl
					})
			})


		}
	};


	const uploadPic = async (downloadURL: string) => {

		try {
			if (props.isProfile) {
				UserStore.uploadProfilePicture(downloadURL, UserStore.user)
				toast.success(t('SUCCESS'));
				setupdatedPicture(downloadURL)
			}
			else {
				UserStore.uploadBackgroundPicture(downloadURL, UserStore.user)
				toast.success(t('SUCCESS'));
				setupdatedPicture(downloadURL)
			}
		} catch (error) {
			console.error("Error uploading background picture:", error);
			toast.error("Failed to upload background picture");
		}
	};
	const triggerFileInput = () => {
		const fileInput = document.getElementById("picInput");
		if (fileInput) {
			fileInput.click();
			//uploadPic(fileInput)
		}
	};
	const removePicture = () => {

		if (props.isProfile) {
			UserStore.uploadProfilePicture('', UserStore.user)
			toast.success(t('SUCCESS'));
			setupdatedPicture('')
		}
		else {
			UserStore.uploadBackgroundPicture('data:image/jpeg;base64,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', UserStore.user)
			toast.success(t('SUCCESS'));
			setupdatedPicture('data:image/jpeg;base64,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')
		}
	}

	return (
		<div style={{ overflow: 'hidden' }}>
			<Popup popupTitle='' width='50vh'>
				<ToastComponent />
				<div ref={dialogRef} className={styles.main} style={{ marginTop: '50px', overflow: 'none', justifyContent: 'center', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					{updatedPicture && updatedPicture.length > 0 ? (
						<div style={{ marginBottom: '50px' }}>
							<label htmlFor="picInput">
								<img
									src={updatedPicture}

									alt="Background"
									style={{ borderRadius: props.isProfile ? '50%' : '0%', width: '100%', cursor: "pointer", display: 'flex', height: '100%' }}
								/>
							</label>
							<input
								type="file"
								id="picInput"
								accept="image/*"
								style={{ display: "none" }}
								onChange={handleBackgroundPicChange}
							/>
						</div>

					) : !props.isProfile ? (

						<div style={{ marginBottom: '50px' }}>
							<label htmlFor="picInput">
								<img
									src={updatedPicture}

									alt="Background"
									style={{ borderRadius: props.isProfile ? '50%' : '0%', width: '100%', cursor: "pointer", display: 'flex', height: '100%' }}
								/>
							</label>
							<input
								type="file"
								id="picInput"
								accept="image/*"
								style={{ display: "none" }}
								onChange={handleBackgroundPicChange}
							/>
						</div>
					) :

						<label htmlFor="picInput">
							<div className={stylesProfilePioc.profileForm} style={{ display: 'flex', justifyContent: 'center', backgroundColor: `${getbackgroundColor()}`, width: '170px', height: '170px', marginBottom: '30px' }} >
								<span style={{ display: 'flex', justifyContent: "center", alignItems: 'center', fontWeight: 'bold', fontSize: '70px' }}>{initials()}</span>
							</div>
							<input
								type="file"
								id="picInput"
								accept="image/*"
								style={{ display: "none" }}
								onChange={handleBackgroundPicChange}
							/>
						</label>}


					{props.user && UserStore.user.id === props.user.id && (
						<div style={{ display: 'flex', justifyContent: 'center', gap: '50px' }} >
							<div className={styles.settings} onClick={triggerFileInput} style={{ gap: '8px' }} >
								<img src={addPhoto} style={{ width: '25px' }} />
								<span className={globalstyles.mainGreySpan}> {t('add photo')}</span>
							</div>
							<div className={styles.settings} onClick={removePicture}>
								<img src={d} style={{ width: '30px' }} />
								<span className={globalstyles.mainGreySpan}>{t('delete photo')}</span>
							</div>
						</div>
					)}
				</div>

			</Popup>
		</div>
	);
};

export default PicturePopup;

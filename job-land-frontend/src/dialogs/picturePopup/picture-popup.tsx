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

export interface PicturePopupProps {
	isOpen: boolean;
	onClose: (success: boolean) => void;
	children?: ReactNode;
	picture: string
	isProfile: boolean
}

const PicturePopup = (props: PicturePopupProps) => {
	const dialogRef = useRef<HTMLDivElement>(null);
	// Language
	const { t } = useTranslation();
	const { i18n } = useTranslation();
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
			uploadPic(file);
		}
	};


	const uploadPic = async (file: any) => {

		const formData = new FormData();

		formData.append("backgroundPic", file);
		console.log(formData);

		try {

			if (props.isProfile) {
				UserStore.uploadProfilePicture(file, UserStore.user)
			}
			else {
				UserStore.uploadBackgroundPicture(formData)

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
			uploadPic(fileInput)
		}
	};


	return (
		<div style={{ overflow: 'hidden' }}>
			<Popup>
				<ToastComponent />
				<div ref={dialogRef} className={styles.main} style={{ marginTop: '50px', overflow: 'none', justifyContent: 'center', height: '100%', width: '100%', display: 'grid', }}>
					<div style={{ marginBottom: '50px' }}>
						<label htmlFor="picInput">
							<img
								src={props.picture}

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
					<div style={{ display: 'flex', justifyContent: 'center', gap: '50px' }}>
						<div className={styles.settings} onClick={triggerFileInput} >
							<img src={addPhoto} style={{ width: '25px' }} />
							<span className={globalstyles.mainGreySpan}> {t('add photo')}</span>
						</div>
						<div className={styles.settings} >
							<img src={d} style={{ width: '30px' }} />
							<span className={globalstyles.mainGreySpan}>{t('delete photo')}</span>
						</div>					</div>
				</div>
			</Popup>
		</div>
	);
};

export default PicturePopup;

import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import React, { useContext, useEffect, useState } from "react";
import en from '../../assets/images/languages/en.png'
import he from '../../assets/images/languages/he.png'
import { useNavigate } from "react-router";
import arrowLeft from "../../assets/images/arrowLeft.png"
import arrowRight from "../../assets/images/arrowRight.png"
import emailjs from '@emailjs/browser';

import ToastComponent from "../../base-components/toaster/ToastComponent";
import globals from "../login/login.module.scss";
import { TextInputComponent } from "react-native";
import TextInputField from "../../base-components/text-input/text-input-field";
const ForgotPassComponent = observer(() => {
	const [startIndex, setStartIndex] = useState(0);
	const navigate = useNavigate();
	//language
	const { t } = useTranslation();
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		UserStore.setLanguage(lng)
		i18n.changeLanguage(lng);
	};
	const goBack = () => {
		UserStore.setForgotPass(false)

		navigate('/')
	}
	const [userEmail, setUserEmail] = useState('');

	const handleInputChangeEmail = (value: string) => {
		setUserEmail(value);
	};
	const sendEmail = async () => {
		if (userEmail.length == 0) {
			window.alert('Email is empty')

		}

		else if (!userEmail.includes('@')) {
			window.alert('Email is invalid, please try again')

		}
		else {
			await UserStore.getUsers();
			const user = UserStore.getUserByEmail(userEmail)
			console.log(user)
			const serviceID = "service_ktqrx6g";
			const templateID = "template_popyu06";
			const params = { from_name: "Job Land", email: userEmail, to_name: user?.name, message: "Hi, here is your password ! " + "'" + user?.password + "' \n" + "Please save it" }
			try {
				const res = await emailjs.send(serviceID, templateID, params, {
					publicKey: 'uBgCORDaioscnVWOQ'
				}
				);
				window.alert('Please check your email \n We sent your password')
			} catch (err) {
				console.log(err);
			}


		}
	}
	return (
		<>

			<div className={globals.form} dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
				<div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
					{/*header*/}
					<div className={globals.formHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
						{UserStore.getLanguage() == 'en' ? (<img onClick={() => goBack()} src={arrowLeft} style={{ position: 'relative', top: '20px', marginInlineStart: '50px', cursor: 'pointer', width: '80px' }} />) :
							<img onClick={() => goBack()} src={arrowRight} style={{ cursor: 'pointer', width: '80px', marginInlineStart: '50px', position: 'relative', top: '20px' }} />
						}
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<h2 className={globals.title} > {t('Forgot a password ?')}  </h2>
						</div>
						<div className={globals.languageDiv}>
							{UserStore.getLanguage() == 'en' ?
								<img src={he} className={globals.heLanguagePic} onClick={() => changeLanguage('he')} />
								:
								<img src={en} className={globals.enlanguagePic} onClick={() => changeLanguage('en')} />
							}
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', gap: '50px' }}>
						{/* <h2 className={globals.title} > {t('Create a new password')}  </h2> */}
						<div style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
							<TextInputField type={'text'} placeHolder={t('Enter Your Email')} text={t('Email')} value={userEmail} size="small" onChange={handleInputChangeEmail} />
						</div>
						<button className={globals.btn} onClick={() => sendEmail()}>
							<span className={globals.span}>{t('send')}</span>
						</button>
					</div>


				</div>
			</div>

			{/*toast*/}
			<ToastComponent />
		</>

	);
})
export default ForgotPassComponent
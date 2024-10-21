import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Company } from "../../interfaces/company";
import jobsStore from "../../store/job";
import styles from '../network/network.module.scss'
import globalStyles from "../../assets/global-styles/styles.module.scss";

import ProfileImage from "../../base-components/profile-image/profile-image-component";
import { useNavigate } from "react-router";
const CompaniesPage = observer(() => {

	//language  
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const [companies, setCompanies] = useState<Company[]>(jobsStore.companies);
	const navigate = useNavigate();
	// // update every 5 minutes the posts
	useEffect(() => {
		const fetchData = async () => {
			try {
				await jobsStore.getAllComapnies(); // Ensure this method is async or returns a Promise
			} catch (error) {
				console.error('Failed to fetch companies', error);
			}
		};

		fetchData();
	}, [jobsStore]); // Add jobsStore to the dependency array if it can change



	const goToCompanyProfile = (companyId: string) => {
		UserStore.setLoading(true);
		setTimeout(() => {
			UserStore.setLoading(false);
			navigate(`/company/${companyId}`);
			UserStore.setTab("Company")
		}, 1000)
	}
	return (
		<>


			<div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
				<div style={{ marginTop: '90px', display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%' }} >


					<div style={{ display: "flex", flexDirection: 'row', gap: '20px', flexWrap: 'wrap', maxHeight: '100vh' }}>
						{companies.map((company: Company, index) => (
							<div className={styles.jobContainer} key={index} onClick={() => goToCompanyProfile(company._id)}>
								<div className={styles.jobContainer__header} > <ProfileImage user={company} /> </div>
								<div className={styles.jobContainer__body}>
									<span style={{ fontSize: '22px', color: '#1c1c39' }}> {company.name}</span>
									<span style={{ color: '#717273', fontSize: '19px', fontWeight: 'normal', wordBreak: 'break-word', overflow: 'hidden', maxHeight: '30px', maxWidth: '200px' }} className={globalStyles.simpleP}> {company.about ? company.about : 'No about'}</span>
									{/* <button style={{ width: '15vh', display: 'flex', gap: '8px', height: '35px', alignItems: 'center', fontSize: '18px' }} className={globalStyles.btn_border}>
										<i style={{ fontSize: '17px' }} className="fa fa-plus" aria-hidden="true"></i>
										<span style={{ fontSize: '17px' }}> {t('Follow')}</span>
									</button> */}
								</div>
							</div>))}
					</div>
				</div>


			</div>
		</>

	);
})
export default CompaniesPage
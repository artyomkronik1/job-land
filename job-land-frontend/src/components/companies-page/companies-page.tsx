import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
const CompaniesPage = observer(() => {

	//language  
	const { t } = useTranslation();
	const { i18n } = useTranslation();

	return (
		<>


			<div dir={UserStore.getLanguage() == 'en' ? 'ltr' : 'rtl'}>
				<div style={{ marginTop: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >
				</div>


			</div>
		</>

	);
})
export default CompaniesPage
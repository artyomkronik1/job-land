import { observer } from "mobx-react-lite";
import UserStore from '../../store/user';
import { useTranslation } from "react-i18next";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Table from "../../base-components/table/table";
import { Job } from "../../interfaces/job";
import jobsStore from "../../store/job";
import { User } from "../../interfaces/user";
import globals from "../../assets/global-styles/styles.module.scss";

const ApplicationsComponent = observer(() => {
	//language
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	useEffect(() => {
		//UserStore.getUsers();
		//jobsStore.getALlJobs(); // Call the function when filters change
	}, []);


	const rows: any[] = jobsStore.filterJobs.map(job => {
		// Find names of users who applied for this job
		const applicants = UserStore.users.filter(user => job.applications.includes(user.id));

		const applicantNames = applicants.map(app => app.name).join(', ');
		const applicantAbouts = applicants.map(app => app.about.slice(0, 15).trimEnd() + '...').join(', ');

		const applicantExperiences = applicants.map(app => app.experience).join(', ');
		const applicantEducations = applicants.map(app => app.education).join(', ');
		console.log(job.title);

		return {
			job_title: job.title,
			username: applicantNames,
			about: applicantAbouts, // Replace with actual data if available
			experience: applicantExperiences, // Replace with actual data if available
			education: applicantEducations, // Replace with actual data if available
		};
	});


	const columns: (keyof any)[] = ['job_title', 'username', 'about', 'experience', 'education']; // Column names


	return (
		<div dir={UserStore.getLanguage() === "en" ? "ltr" : "rtl"}>
			<div style={{ marginTop: "90px", display: "flex", flexDirection: "column", alignItems: "start", width: "100%", flexWrap: "wrap" }}>
				<p className={globals.h2}> {t('Your jobs and candidates')} </p>
				<Table
					rows={rows}
					columns={columns}
					rowCount={rows.length}
					pageSize={5}
				/>
			</div>
		</div>
	);
})
export default ApplicationsComponent
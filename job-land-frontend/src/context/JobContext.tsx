import React from 'react';
import userStore from '../store/user';
import jobsStore from '../store/job';
export const JobContext = React.createContext(jobsStore);

export const JobsProvider: React.FC = ({ children }: any) => {
	return (
		<JobContext.Provider value={jobsStore}>
			{children}
		</JobContext.Provider>
	);
};

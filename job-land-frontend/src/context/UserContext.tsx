import React from 'react';
import userStore from '../store/user';
export const UserContext = React.createContext(userStore);

export const UserProvider: React.FC = ({ children }: any) => {
	return (
		<UserContext.Provider value={userStore}>
			{children}
		</UserContext.Provider>
	);
};


export interface UsersNotification {
	_id?: string;
	message: string;
	to: string;
	time: string;
	link?: string;
	from: string;
	type?: string
	// types :
	// post
	// new connection - user
	// your friend posted a new post - post
}
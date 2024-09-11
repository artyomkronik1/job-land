

import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
	message: { type: String, required: false },
	to: { type: String, required: false },
	time: { type: String, required: false },
	link: { type: String, required: false },
	type: { type: String, required: false },
	from: { type: String, required: false },


})


export interface notification {
	_id: string;
	message: string;
	to: string;
	time: string;
	link?: string;
	type?: string;
	from: string;

}

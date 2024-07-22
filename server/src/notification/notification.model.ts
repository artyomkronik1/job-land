

import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
	message: { type: String, required: false },
	to: { type: String, required: false },
})


export interface notification {
	_id: string;
	message: string;
	to: string;
}

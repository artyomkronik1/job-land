import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { notification } from './notification.model';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('Post') private readonly postModel: Model<notification>) { }

}

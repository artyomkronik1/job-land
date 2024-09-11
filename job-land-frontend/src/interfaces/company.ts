import { Job } from "./job";
import { User } from "./user";

export interface Company {
	_id: string;
	name: string;
	location: string;
	about: string;
	jobs: Job[]
	workers: User[];
	profilePicture: string;
	backgroundPicture: string;
}
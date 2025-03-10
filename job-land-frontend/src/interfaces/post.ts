import { comment } from "./comment";

export interface Post {
    _id: string;
    title: string;
    description: string;
    employee_id: string;
    likedBy: string[];
    writer_name: string;
    picture: string;
    comments: comment[];
}
import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    employee_id:{type:String, required:true},
})

export interface Post{
    id: string;
    title: string;
    description: string;
   employee_id:string;
}


import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
    title:{type:String, required:false},
    description:{type:String, required:true},
    employee_id:{type:String, required:true},
    likedBy:{type:Array, required:true},
    writer_name:{type:String, required:true},
    comments:{type:Array,required:true}
})

export interface Post{
    id: string;
    title: string;
    description: string;
   employee_id:string;
   writer_name:string;
    likedBy:string[];
    comments:comment[]
}

export interface comment{
    text:string;
    by:string;
}


import * as mongoose from 'mongoose';

export const JobSchema = new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    salary:{type:Number, required:true},
    hire_manager_id:{type:String, required:true},
    hire_name:{type:String, required:true},
    company_name:{type:String, required:true},

})

export interface Job{
    id: string;
    title: string;
    description: string;
    salary: number;
    hire_name:string;
    company_name:string;
    hire_manager_id: string;
}
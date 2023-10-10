import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({

    name:{type:String, required:true},
    password:{type:String, required:true},
    email:{type:String, required:true},
    role:{type:String, required:true},

})

export interface User{
     id: string;
    name: string;
    password: string;
    email: string;
    role: string;
}
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import {UserSchema} from "./user.model";

const secretKey = 'job-land'; // Replace with your secret key
import * as crypto  from "crypto";
import {makeFollowData} from "./user.controller";
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async logIn(email: string, password: string) {
    const decryptedPassword = CryptoJS.AES.decrypt(
        password,
        secretKey,
    ).toString(CryptoJS.enc.Utf8);
    //find user by email
    const user = await this.userModel
      .find({ email: email, password: decryptedPassword })
      .select('id name email password role follow about')
      .exec();
    if (user.length > 0) {
      const sessionKey = this.generateSessionKey();
      return {
        success: true,
        user: {
          id:user[0].id,
          name:user[0].name,
          role:user[0].role,
          email:user[0].email,
          password:password,
          follow:user[0].follow,
          about:user[0].about
        },
        session_key: sessionKey,
      };
    } else {
      return {
        success: false,
        errorCode: 'email/password_is_incorrect',
      };
    }
  }
  generateSessionKey(): string {
    return crypto.randomBytes(32).toString('hex'); // Generate a 64-character random string
  }
  async signUp(user: any) {
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);

    //check if user already exist
    const isAlredyExist = await this.userModel
      .find({
        email: user.email,
        password: decryptedPassword,
        name: user.name,
        role: user.role,
      })
      .exec();
    if (isAlredyExist.length > 0) {
      return {
        success: false,
        errorCode: 'user_already_exist',
      };
    } else {
      const newUser = new this.userModel({
        name: user.name,
        password: decryptedPassword,
        email: user.email,
        role: user.role,
        follow:[],
        about:''
      });
      const result = await newUser.save();
      if (result) {
        const sessionKey = this.generateSessionKey();
        return {
          success: true,
          user: {
            id:newUser.id,
            name:newUser.name,
            role:newUser.role,
            email:newUser.email,
            password:user.password,
            follow:[],
           about:""
          },
          session_key: sessionKey,
        };
      } else {
        return {
          success: false,
          errorCode: 'fail_to_signup',
        };
      }
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
  public async makeFollow(info:makeFollowData){
    const myUser = await this.getSingleUser(info.userId);
    const userToFollow = await this.getSingleUser(info.userIdToFollow)
    myUser.user.follow = [...myUser.user.follow, userToFollow.user.id]

    const updatedUser = await this.userModel.findByIdAndUpdate(info.userId, { follow: myUser.user.follow }, { new: false });

    return {success:true, user:myUser}

  }
  public async setUser(info:any) {

    let u = await this.userModel.findById(info.user.id);
    console.log( u)
    if (!u) {
      // Handle the case where the user with the given ID is not found
      return {success: false, errorCode: 'fail_to_find_user',};
    } else {
      u.name = info.user.name;
      u.about = info.user.about
      await u.save()
        return {success: true, user: u}
    }
  }
  public async getSingleUser(id: string) {
    const user = await this.userModel.findById(id);
    if (user) {
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          follow:user.follow,
          about:user.about
        },
      };
    } else {
      return {
        success: false,
        errorCode: 'fail_to_find_user',
      };
    }
  }

  public async getUsers() {
    const users = await this.userModel.find().exec();
    if (users && users.length > 0) {
      return {
        success: true,
        users: users.map((user: User) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          about:user.about,
          follow:user.follow
        })),
      };
    } else {
      return {
        success: false,
        errorCode: 'fail_to_find_users',
      };
    }
  }
}

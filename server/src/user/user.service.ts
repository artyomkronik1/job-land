import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async logIn(email: string, password: string) {
    const user = await this.userModel
      .find({ email, password })
      .select('id name email password role')
      .exec();
    if (user.length > 0) {
      return {
        success: true,
        user: user,
      };
    } else {
      return {
        success: false,
        errorCode: '0011',
      };
    }
  }
  async insertUser(user: User) {
    const newUser = new this.userModel({
      name: user.name,
      password: user.password,
      email: user.email,
      role: user.role,
    });
    const result = await newUser.save();
    if (result) {
      return {
        success: true,
        user: newUser,
      };
    } else {
      return {
        success: false,
        errorCode: '002',
      };
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
        },
      };
    } else {
      return {
        success: false,
        errorCode: '0011',
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
        })),
      };
    } else {
      return {
        success: false,
        errorCode: '001',
      };
    }
  }
}

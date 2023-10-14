import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async logIn(email: string, password: string) {
    //find user by email
    const user = await this.userModel
      .find({ email })
      .select('id name email password role')
      .exec();
    //compare encrypted passwords
    const isPasswordValid = await this.comparePasswords(
      password,
      user[0].password,
    );
    //if there is same password is success
    if (isPasswordValid) {
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
    //check if user already exist
    const isAlredyExist = await this.userModel.find({ email:user.email, password:user.password,name:user.name, role:user.role}).exec()
    if(isAlredyExist.length>0){
      return {
        success: false,
        errorCode: '005',
      };
    }
    else {
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

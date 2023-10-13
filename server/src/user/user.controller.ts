import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from "./user.model";
export class loginData {
  readonly email: string;
  readonly password: string;
}
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Body() data: any) {
    if(data.id && data.id.length>0) {
      return this.userService.getSingleUser(data.id);
    } else{
      return this.userService.getUsers();
      }
  }

  @Post('/signup')
  async signUp(@Body() user: User) {
    return this.userService.insertUser(user);
  }
  @Post('/login')
  async logIn(@Body() data: loginData) {
    return this.userService.logIn(data.email, data.password);
  }
}


import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from "./user.model";

export class loginData {
  readonly email: string;
  readonly password: string;
}
export class makeFollowData {
  readonly userId: string;
  readonly userIdToFollow: string;
}
export class signupData {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
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
  @Post('/follow')
  async makeFollow(@Body()info:makeFollowData)
  {
    return this.userService.makeFollow(info)
  }
  @Post('/user')
  async setUser(@Body()user:User)
  {
    return this.userService.setUser(user)
  }

  @Post('/signup')
  async signUp(@Body() user: signupData) {
    return this.userService.signUp(user);
  }
  @Post('/login')
  async logIn(@Body() data: loginData) {
    return this.userService.logIn(data.email, data.password);
  }
}


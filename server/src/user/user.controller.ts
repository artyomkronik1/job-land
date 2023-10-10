import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from "./user.model";

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

  @Post()
  async newUser(@Body() user: User) {
    return this.userService.insertUser(user);
  }
}

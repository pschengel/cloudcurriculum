import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  addUser(@Body('name') userName: string, @Body('email') userEmail: string) {
    const generatedId = this.userService.insertUser(userName, userEmail);
    return { id: generatedId };
  }

  @Get()
  getAllUser() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id') userId: string) {
    return this.userService.getSingleUser(userId);
  }

  @Put(':id')
  putUser(
    @Param('id') userId: string,
    @Body('name') userName: string,
    @Body('email') userEmail: string,
  ) {
    this.userService.putUser(userId, userName, userEmail);
    return null;
  }

  @Delete(':id')
  removeUser(@Param('id') userId: string) {
    this.userService.deleteUser(userId);
    return null;
  }
}

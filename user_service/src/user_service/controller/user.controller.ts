// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { runInThisContext } from 'vm';
// import { UserI } from '../models/user.interface';
// import { UserService } from '../service/user.service';

// @Controller('users')
// export class UserController {
//   constructor(private userService: UserService) {}

//   @Post()
//   add(@Body() user: UserI): Observable<UserI> {
//     return this.userService.add(user);
//   }

//   @Get()
//   findAll(): Observable<UserI[]> {
//     return this.userService.findAll();
//   }
// }

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  //get all users
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  //get user by id
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  //create user
  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  //update user
  @Put(':id')
  async update(@Param('id') id: number, @Body() user: User): Promise<any> {
    return this.usersService.update(id, user);
  }

  //delete user
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    //handle error if user does not exist
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.delete(id);
  }
}

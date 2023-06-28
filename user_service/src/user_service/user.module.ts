// import { Module } from '@nestjs/common';

// import { UserController } from './controller/user.controller';
// import { UserService } from './service/user.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserEntity } from './models/user.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([UserEntity])],
//   controllers: [UserController],
//   providers: [UserService],
// })
// export class UserModule {}

import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}

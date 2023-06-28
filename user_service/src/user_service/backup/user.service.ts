import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from './user.model';

@Injectable()
export class UserService {
  private users: User[] = [];

  insertUser(name: string, email: string) {
    const userId = Math.random().toString();
    const newUser = new User(userId, name, email);
    this.users.push(newUser);
    return userId;
  }

  getUsers() {
    return [...this.users]; //creating new array -> prevent bugs
  }

  getSingleUser(userId: string) {
    const user = this.findUser(userId)[0];
    return { ...user };
  }

  putUser(userId: string, name: string, email: string) {
    const [user, index] = this.findUser(userId);
    const updatedUser = { ...user };
    if (name) {
      updatedUser.name = name;
    }
    if (email) {
      updatedUser.email = email;
    }
    this.users[index] = updatedUser;
  }

  deleteUser(userId: string) {
    const index = this.findUser(userId)[1];
    this.users.splice(index, 1);
  }

  private findUser(id: string): [User, number] {
    const userIndex = this.users.findIndex((user) => user.id === id);
    const user = this.users[userIndex];
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return [user, userIndex];
  }
}

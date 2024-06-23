import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/DTOs/User.DTO';

@Injectable()
export class UsersRepository {
  private users = [
    {
      id: 1,
      name: 'Bartolomeu 1',
      email: 'barto@mail.com',
    },
    {
      id: 2,
      name: 'Pedro 2',
      email: 'pedro@mail.com',
    },
    {
      id: 3,
      name: 'Maria 3',
      email: 'maria@mail.com',
    },
  ];
  async getUsers() {
    return this.users;
  }

  async getUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  async getUsersByName(name: string) {
    return this.users.filter((user) => user.name === name);
  }

  async createUser(user: UserDTO) {
    this.users.push(user);
    console.log('User created: ', user);

    return user;
  }
}

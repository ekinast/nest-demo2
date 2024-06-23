import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserDTO } from 'src/DTOs/User.DTO';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}
  getUsers() {
    return this.usersRepository.getUsers();
  }

  getUserById(id: number) {
    return this.usersRepository.getUserById(id);
  }

  getUsersByName(name: string) {
    return this.usersRepository.getUsersByName(name);
  }

  createUser(user: UserDTO) {
    return this.usersRepository.createUser(user);
  }
}

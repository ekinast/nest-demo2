import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { response } from 'express';

@Injectable()
export class UsersDBService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  saveUser(user: Partial<User>) {
    return this.usersRepository.save(user);
  }

  async getUserById(id: string): Promise<User> {
    try {
      const userFound = await this.usersRepository.findOne({ where: { id } });
      if (!userFound) {
        throw new Error('Usuario no encontrado');
      }
      return userFound;
    } catch (error) {
      throw new Error(error.message || 'Database query failed');
    }
  }

  getUsersByName(name: string) {
    return this.usersRepository.find({ where: { name } });
  }
  getUsers() {
    return this.usersRepository.find();
  }

  getUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
}

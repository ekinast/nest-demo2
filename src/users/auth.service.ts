import { JwtService } from '@nestjs/jwt';
import { User } from './users.entity';
import { UsersDBService } from './usersDB.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersDBService: UsersDBService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: Partial<User>) {
    const newUser = await this.usersDBService.getUserByEmail(user.email);
    if (newUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Password hashing failed');
    }
    return this.usersDBService.saveUser({ ...user, password: hashedPassword });
    //return { success: 'User created successfully' };
  }

  async signIn(email: string, password: string) {
    const dBUser = await this.usersDBService.getUserByEmail(email);
    if (!dBUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, dBUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userPayload = {
      sub: dBUser.id,
      id: dBUser.id,
      email: dBUser.email,
      roles: [dBUser.IsAdmin ? Role.Admin : Role.User],
    };

    const token = this.jwtService.sign(userPayload);

    return { succes: 'User logged in successfully', token };
  }
}

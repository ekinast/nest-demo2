import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersDBService } from './usersDB.service';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

describe('authService', () => {
  let authService: AuthService;
  let mockUsersDBService: Partial<UsersDBService>;
  const mockUser: Partial<User> = {
    name: 'John Doe',
    createdAt: '01/01/2024',
    password: '12345678',
    email: 'jdoe@mail.com',
    IsAdmin: false,
  };

  beforeEach(async () => {
    mockUsersDBService = {
      getUserByEmail: () => Promise.resolve(undefined),
      saveUser: (user: Omit<User, 'id'>): Promise<User> =>
        Promise.resolve({
          ...user,
          IsAdmin: false,
          id: '1234fs-234sd-24csfd-34sdfg',
        }),
    };

    const mockJwtService = {
      sign: (payload) => jwt.sign(payload, 'testSecretKey'),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersDBService, useValue: mockUsersDBService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('create an instance of AuthService', async () => {
    expect(authService).toBeDefined();
  });

  it('signUp should create a new user with an encripted password', async () => {
    const newUser = await authService.signUp(mockUser as User);
    expect(newUser).toBeDefined();
    expect(newUser.password).not.toEqual(mockUser.password);
    //expect(newUser).toEqual({ success: 'User created successfully' });
  });

  it('signUp() throws an error if the email is already in use', async () => {
    mockUsersDBService.getUserByEmail = (email: string) =>
      Promise.resolve(mockUser as User);
    try {
      await authService.signUp(mockUser as User);
    } catch (error) {
      expect(error.message).toEqual('User already exists');
    }
  });

  it('signIn() should return an error if password invalid', async () => {
    mockUsersDBService.getUserByEmail = (email: string) =>
      Promise.resolve(mockUser as User);

    try {
      await authService.signIn(mockUser.email, 'wrongPassword');
    } catch (error) {
      expect(error.message).toEqual('Invalid credentials');
    }
  });

  it('signIn returns an error if user not found', async () => {
    try {
      await authService.signIn(mockUser.email, mockUser.password);
    } catch (error) {
      expect(error.message).toEqual('Invalid credentials');
    }
  });

  it('signIn() returns an object with a message and a token if user is found and the password is valid', async () => {
    const mockUserVariant = {
      ...mockUser,
      password: await bcrypt.hashSync(mockUser.password, 10),
    };
    mockUsersDBService.getUserByEmail = (email: string) =>
      Promise.resolve(mockUserVariant as User);
    const response = await authService.signIn(
      mockUser.email,
      mockUser.password,
    );

    expect(response).toBeDefined();
    expect(response.succes).toEqual('User logged in successfully');
    expect(response).toHaveProperty('token');
    expect(response.token).toBeDefined();
  });
});

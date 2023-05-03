import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of users Service
    const users: User[] = [];
    fakeUsersService = {
      findOneByEmail: (email: string) => {
        const user = users.find((user) => user.email === email);
        return Promise.resolve(user ?? null);
      },

      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hased password', async () => {
    const user = await service.signup('testuser99@gmail.com', 'test@123');

    expect(user.password).not.toEqual('test@123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email already in use', async () => {
    await service.signup('testuser99@gmail.com', 'test@123');

    expect(async () => {
      await service.signup('testuser99@gmail.com', 'test@123');
    }).rejects.toThrow(BadRequestException);
  });

  it('throws error if sign in is called with unused email', async () => {
    expect(async () => {
      await service.signin('testuser99@gmail.com', 'test@123');
    }).rejects.toThrow(NotFoundException);
  });

  it('throws error if invalid password is provided', async () => {
    await service.signup('testuser99@gmail.com', '123@test');

    expect(async () => {
      await service.signin('testuser99@gmail.com', 'test@123');
    }).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('testuser99@gmail.com', 'test@123');

    const user = await service.signin('testuser99@gmail.com', 'test@123');
    expect(user).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findAllByEmail: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'test@123' } as User]),
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'testuser99@gmail.com',
          password: 'test@123',
        } as User),
    };
    fakeAuthService = {
      signin: (email: string, password: string) =>
        Promise.resolve({
          id: 1,
          email,
          password,
        } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers With Particular email returns a list of users with the given email', async () => {
    const users = await controller.findUsersByEmail('testuser99@gmail.com');
    // expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('testuser99@gmail.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUserById('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with the given id is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);

    expect(async () => {
      await controller.findUserById('1');
    }).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: 888 };
    const user = await controller.signin(
      {
        email: 'testuser99@gmail.com',
        password: 'test@123',
      },
      session,
    );

    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });
});

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
    fakeUsersService = {
      findOneByEmail: () => Promise.resolve(null),

      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    fakeUsersService.findOneByEmail = () =>
      Promise.resolve({
        id: 99,
        email: 'testuser99@gmail.com',
        password: 'test@123',
      } as User);

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
    fakeUsersService.findOneByEmail = () =>
      Promise.resolve({
        id: 99,
        email: 'testuser99@gmail.com',
        password: '123@test',
      } as User);

    expect(async () => {
      await service.signin('testuser99@gmail.com', 'test@123');
    }).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    // const user = await service.signup('testuser99@gmail.com', 'test@123');
    // console.log(user.password);

    // copy and paste password from console

    fakeUsersService.findOneByEmail = () =>
      Promise.resolve({
        id: 99,
        email: 'testuser99@gmail.com',
        password:
          '4fb8854ed5cafb92.a08db4340ef5323072f206862878c426dc10aa86be4e2531b4fc052a84091ab5',
      } as User);

    const user = await service.signin('testuser99@gmail.com', 'test@123');
    expect(user).toBeDefined();
  });
});

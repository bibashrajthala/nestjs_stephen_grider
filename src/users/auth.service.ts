import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email already exists
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('Email already registered!');
    }

    // hash the password

    /// generate salt
    const salt = randomBytes(8).toString('hex');

    /// hash salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    /// join the hashed result and salt together
    const result = salt + '.' + hash.toString('hex');

    // create a new user and save it
    const newUser = await this.userService.create(email, result);

    //return the created new user
    return newUser;
  }

  async signin(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    return user;
  }
}

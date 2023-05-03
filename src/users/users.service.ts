import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  //
  create(email: string, password: string) {
    const user = this.userRepository.create({ email, password });

    return this.userRepository.save(user);
  }

  //
  async find() {
    const users = await this.userRepository.find();

    return users;
  }

  //
  async findOne(id: number) {
    if (!id) {
      return null;
    }
    const user = await this.userRepository.findOneBy({ id });

    // const user = await this.userRepository.findOne({
    //   where: {
    //     id,
    //   },
    //   select: ['id', 'email'],
    // });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  //
  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    // if (!user) {
    //   throw new NotFoundException('User not found!');
    // }

    return user;
  }

  //
  async findAllByEmail(email: string) {
    const users = await this.userRepository.find({ where: { email } });

    return users;
  }

  //
  async update(id: number, attrs: Partial<User>) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  //
  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.userRepository.remove(user);
  }
}

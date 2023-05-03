import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  // UseInterceptors,
  //   ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
// import { CurrentUserInterceptor } from './current-user.interceptor';

@Controller('auth')
@Serialize(UserDto) // to serialize all req handler of a controller , if you want to only serialize response of particular handlers remove it from this controller and place it in only those handlers
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoami(@CurrentUser() user: User) {
    return user;
  }

  // @Get('/whoami')
  // whoami(@Session() session: any) {
  //   return this.userService.findOne(session.userId);
  // }

  @Get('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/users')
  listAllUsers() {
    return this.userService.find();
  }

  //   @UseInterceptors(SerializeInterceptor)
  //   @Serialize(UserDto)
  @Get('/:id')
  findUserById(@Param('id') id: string) {
    // console.log('Request Handler is running');
    return this.userService.findOne(parseInt(id));
  }

  //   @Get()
  //   findUserByEmail(@Query('email') email: string) {
  //     return this.userService.findOneByEmail(email);
  //   }

  @Get()
  async findUsersByEmail(@Query('email') email: string) {
    const user = await this.userService.findAllByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}

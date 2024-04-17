import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserAuthModel } from '../users/dto/user-auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('/login')
  async login(
    @Body(new ValidationPipe()) auth: UserAuthModel,
  ): Promise<string> {
    return this.authService.authenticate(auth);
  }

  @Post('/register')
  async register(
    @Body(new ValidationPipe()) userModel: CreateUserDto,
  ): Promise<string> {
    const emailExists = await this.userService.findByEmail(userModel.email);

    if (emailExists) {
      throw new UnprocessableEntityException();
    }

    await this.userService.create(userModel);

    return this.authService.authenticate(userModel);
  }
}

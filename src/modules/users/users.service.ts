import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { compact, isEmpty, uniqBy } from 'lodash';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async create(user: CreateUserDto): Promise<User> {
    const userToCreate = {
      ...user,
      password: await this.getHash(user.password),
    };

    const result = await this.userRepository.save(
      this.userRepository.create(userToCreate),
    );

    return result;
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const result = await this.userRepository.findOne({
        where: { email },
      });
      return result;
    } catch (error) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          args: { errorMessage: JSON.stringify(error) },
        },
      });
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      return user;
    } catch (err) {
      this.logger.error(`Error ${JSON.stringify(err)}`);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          errorMessage: err.message,
        },
      });
    }
  }

  async getMeUser(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      return user;
    } catch (err) {
      this.logger.error(`Error on getMeUser ${JSON.stringify(err)}`);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          errorMessage: err.message,
        },
      });
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async createUser(userBody: CreateUserDto): Promise<User> {
    try {
      let user = null;

      return user;
    } catch (err) {
      //TODO: Needs to implement custom Error handling in NestJS
      this.logger.error(`Error ${JSON.stringify(err)}`);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          errorMessage: err.message,
        },
      });
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      this.logger.log(`Deleting user with Id: ${userId}`);
      const user = await this.getUser(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      await this.userRepository.delete(userId);
    } catch (error) {
      this.logger.error(`Error while deleting user = ${error}`);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          errorMessage: error.message,
        },
      });
    }
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

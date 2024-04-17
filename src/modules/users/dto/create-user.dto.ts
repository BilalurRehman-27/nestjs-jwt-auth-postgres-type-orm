import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { USER_TYPE } from 'src/types';

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'Email of user',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Is active',
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty({
    description: 'User type',
  })
  @IsEnum(USER_TYPE)
  status?: USER_TYPE = USER_TYPE.SUPERVISOR;

  @ApiProperty({
    description: 'lastLogin',
    default: null,
  })
  lastLogin: Date;
}

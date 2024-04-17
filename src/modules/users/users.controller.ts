import { Controller, Get, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserRequired } from '../auth/auth.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AuthUserRequired()
  @ApiOperation({
    summary: 'Retrieves the authorized user',
  })
  @Get('me')
  async myProfile(@Request() req): Promise<User> {
    // const impersonatedUser = UserStorage.get();
    // if (impersonatedUser) {
    // 	return impersonatedUser;
    // } else {
    // 	this.usersService.updateUser(req.user.id, { lastLogin: new Date() });
    // 	return req.user;
    // }
    return req.user;
  }
}

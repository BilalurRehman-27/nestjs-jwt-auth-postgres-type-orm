import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: any): Promise<any> {
    // Implement your user validation logic here, e.g., fetch user from database
    return { userId: payload.sub, username: payload.username };
  }
  async authenticate(auth): Promise<any> {
    const user = await this.userService.getUserByEmail(auth.email);

    if (!user) {
      throw new BadRequestException();
    }

    const isRightPassword = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    if (!isRightPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.userName,
      token: this.jwtService.sign({ id: user.id }),
    };
  }
}

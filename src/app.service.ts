import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';

//A health check endpoint
@Injectable()
export class AppService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}
	getHello(): string {
		return 'Hello World!';
	}

	async checkHealthStatus(): Promise<boolean> {
		await this.userRepository.findOneBy({ isActive: true });
		return true;
	}
}

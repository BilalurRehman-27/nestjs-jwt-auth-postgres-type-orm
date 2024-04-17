import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseModel {
	@ApiProperty({
		description: 'uuid',
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		description: 'created at',
	})
	@CreateDateColumn()
	createdAt: Date;

	@ApiProperty({
		description: 'updated at',
	})
	@UpdateDateColumn()
	updatedAt: Date;

	@ApiProperty({
		description: 'description',
	})
	@DeleteDateColumn()
	deletedAt: Date;
}

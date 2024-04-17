import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import commonConfig from './common.config';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
	useFactory: async (): Promise<TypeOrmModuleOptions> => commonConfig(),
};

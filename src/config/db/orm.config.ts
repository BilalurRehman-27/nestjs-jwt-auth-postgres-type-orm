import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import commonConfig from './common.config';

dotenv.config();

export const dataSource = new DataSource({
	...commonConfig(),
	migrations: [join(__dirname, '../../../migrations/*.ts')],
	migrationsTableName: 'migrations',
});
dataSource.initialize();

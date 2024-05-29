import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { typeOrmAsyncConfig } from './config/db/db';
import { AuthModule } from './modules/auth/auth.module';
import { UserAuthModel } from './modules/users/dto/user-auth.dto';
import { User } from './modules/users/entities/user.entity';

dotenv.config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UserAuthModel,
    ConfigModule.forRoot({
      load: [appConfig],
      cache: true,
      envFilePath: [process.env.ENV_FILE, '.env.development'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(SetImpersonatedUserMiddleware).forRoutes('*'); // Apply to all routes
//   }
// }

import helmet from 'helmet';
import { json } from 'express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const API_VERSION = '1';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /** Use URI versioning
   * Routes will be in form
   * v1: http://localhost:3001/v1/users
   * v2: http://localhost:3001/v2/users
   */
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION,
  });

  const origin =
    !process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS === '*'
      ? '*'
      : process.env.ALLOWED_ORIGINS.split(',');

  console.log('🚀 ~ bootstrap ~ origin:', origin);
  app.enableCors({ origin });
  // app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(json({ limit: 'Infinity' }));

  /** Add Swagger. Can be accessed on process.env.API_URL/api e.g localhost:3001/api
   * N.B The Add Server builds the default BASE_API when generating client types
   */

  const config = new DocumentBuilder()
    .setTitle('NestJs Auth Api Swagger Service')
    .setDescription('api endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'default',
    )
    .addServer(
      process.env.API_URL || `http://localhost:${process.env.APP_PORT}`,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'NestJs Swagger Documentation',
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  const configService = app.get<ConfigService>(ConfigService);

  await app.listen(configService.get<number>('app.port'), () => {
    console.log(
      `Nest app is listening on port ${configService.get<number>(
        'app.host',
      )} : ${configService.get<number>('app.port')}`,
    );
  });
}
bootstrap();

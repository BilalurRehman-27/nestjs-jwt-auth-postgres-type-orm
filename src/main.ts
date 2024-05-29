import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

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

  app.enableCors({ origin });
  app.use(helmet());
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
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development') {
    const pathToSwaggerStaticFolder = resolve(process.cwd(), 'swagger-static');

    // write swagger json file
    const pathToSwaggerJson = resolve(
      pathToSwaggerStaticFolder,
      'swagger.json',
    );
    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
  }

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

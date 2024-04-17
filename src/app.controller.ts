import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './modules/auth/auth.decorator';

// We use VERSION_NEUTRAL, so we can return a response at "/"
@Public()
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Note: This endpoint is used for health checks at the URL "/".
  // If it doesn't return a 200, the container will fail to deploy.
  @ApiOperation({
    summary:
      'This endpoint is used for health checks at the URL "/". If it doesn\'t return a 200, the container will fail to deploy.',
  })
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Note: This endpoint is used for internal and external health-checks
  // If it doesn't return a 200, the container will fail to deploy / removed from the ALB
  @ApiOperation({
    summary:
      'This endpoint is used for internal and external health-checks. If it doesn\'t return a 200, the container will fail to deploy "/" removed from the ALB',
  })
  @Public()
  @Get('_health')
  async healthCheck(): Promise<{ status: 'ok' }> {
    await this.appService.checkHealthStatus();
    return { status: 'ok' };
  }
}

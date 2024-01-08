import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { ApiKeyGuard } from './auth/guards/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('/api')
  getApiData() {
    return this.appService.getApiData();
  }

  @SetMetadata('isPublic', true) // forma manual => luego lo metemos a los decoradores que armamos
  @Get('/variables')
  getVariables() {
    return this.appService.getVariables();
  }
}

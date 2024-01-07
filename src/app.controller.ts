import {
  Body,
  Controller,
  Get,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './auth/guards/api-key.guard';

import { Public } from './auth/decorators/public.decorator';

@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SetMetadata('isPublic', true)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('/api')
  api() {
    return 'soy el api';
  }

  @Get('/app')
  app() {
    return 'soy el app';
  }

  @Get('/tasks')
  getTasks() {
    return this.appService.getTasks();
  }

  @Post('/tasks')
  createTasks(@Body() data) {
    return this.appService.createTasks(data);
  }
}

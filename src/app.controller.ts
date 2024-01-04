import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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

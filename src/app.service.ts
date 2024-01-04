import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Db } from 'typeorm';
import config from './config';

@Injectable()
export class AppService {
  constructor(
    // @Inject('API_KEY') private apiKey: string,
    @Inject('TASKS') private tasks: any[],
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @Inject('MONGO') private mongodb: Db,
  ) {}
  getHello(): string {
    const apiKey = this.configService.apiKey;
    const name = this.configService.database.name;
    return `Hello World! ${apiKey} ${name}`;
  }
  getTasks() {
    const tasksCollectio = this.mongodb.collection('tasks');
    return tasksCollectio.find().toArray();
  }

  createTasks(data) {
    const task = this.mongodb.collection('tasks');
    return task.insertOne(data);
  }
}

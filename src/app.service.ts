import { Inject, Injectable } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { ConfigType } from '@nestjs/config';
import typesConfig from '../enviroments/typesEnviroments';

@Injectable()
export class AppService {
  constructor(
    @Inject('API_SERVICE') private apiData: any[],
    //private configService: ConfigService, // sin tipado
    @Inject(typesConfig.KEY) private config: ConfigType<typeof typesConfig>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  getApiData() {
    return this.apiData;
  }

  getVariables() {
    // const apiKey = this.configService.get('API_KEY');
    // const dbName = this.configService.get('DATA_BASE');
    const apiKey = this.config.apiKey;
    const dbName = this.config.postgres.dbName;
    const port = this.config.postgres.port;

    return {
      API_KEY: `My API Key is ${apiKey}`,
      DATABASE: `And my Database name is ${dbName}`,
      PORT: `I am working on Port ${port}`,
    };
  }
}

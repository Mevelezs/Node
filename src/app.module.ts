import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { lastValueFrom } from 'rxjs';

import typesConfig from 'enviroments/typesEnviroments';
import { enviroments } from '../enviroments/enviroments';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // configuración para las variables de entorno
      // envFilePath: '.env',// para un solo archivo .env
      envFilePath: enviroments[process.env.NODE_ENV] || '.env', // para multiples ambientes (para la ejecución del .env deseado, desde la terminal se ejecuta NODE_ENV=<nombre del .env> npm run start:dev (este último dev es para que se refresque en desarrollo (nodemon)))
      load: [typesConfig], // para cargar llas config tipadas
      validationSchema: Joi.object({
        API_KEY: Joi.string().optional(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_HOST: Joi.string(),
      }),
      isGlobal: true,
    }),
    ProductsModule,
    UsersModule,
    HttpModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'API_SERVICE',
      useFactory: async (http: HttpService) => {
        const request = http.get('https://jsonplaceholder.typicode.com/todos');
        const tasks = await lastValueFrom(request);
        return tasks.data;
      },
      inject: [HttpService],
    },
  ],
})
export class AppModule {}

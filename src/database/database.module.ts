import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';

import config from '../../enviroments/typesEnviroments';

const client = new Client({
  user: 'root',
  host: 'localhost',
  database: 'nestjs_db',
  password: 'admin123',
  port: 5432,
});

client.connect();

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { host, dbName, password, port, user } = configService.postgres; // o m ysql
        return {
          type: 'postgres', // o mysql
          host,
          port,
          username: user,
          password,
          database: dbName,
          synchronize: false,
          autoLoadEntities: true,
        };
      },
      inject: [config.KEY],
    }),
  ],
  providers: [
    {
      provide: 'CONNECT_DB',
      useValue: client,
    },
    {
      provide: 'POSTGRES_CONNECT',
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, dbName, password, host, port } = configService.postgres;
        const client = new Client({
          user,
          host,
          database: dbName,
          password,
          port,
        });

        client.connect();
        return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: ['CONNECT_DB', 'POSTGRES_CONNECT', TypeOrmModule],
})
export class DatabaseModule {}

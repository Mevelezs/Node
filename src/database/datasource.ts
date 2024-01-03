import { DataSource, DataSourceOptions } from 'typeorm';
// una vez funcione la migración las variables de entorno en este archivo se tienen que leer con dotenv // import * as dotenv from 'dotenv' // hay que istalarlo
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin123',
  database: 'nestjs_db',
  logging: true,
  synchronize: true,
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
};
const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;

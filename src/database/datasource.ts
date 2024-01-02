import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin123',
  database: 'nestjs_db',
  logging: true,
  synchronize: false,
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
};
const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;

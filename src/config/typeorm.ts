import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env.development' });

const config = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Esto es para que TypeORM busque las entidades
  autoLoadEntities: true,
  synchronize: true,
  logging: true,
  // Esto es para que TypeORM busque las entidades
  entities: ['dist/**/*.entity{.js,.ts}'],
  // Esto es para que TypeORM busque las migraciones
  //dropschema: true,
  migrations: ['dist/migrations/*{.js,.ts}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

// Esto es para que esté disponible para la aplicación
export default registerAs('typeorm', () => config);

// Esto es para que esté disponible para el CLI
export const connectionSource = new DataSource(config as DataSourceOptions);

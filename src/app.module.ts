import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { userModule } from './users/users.module';
import { todosModule } from './todos/todos.module';
//import { AuthGuard } from './guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        // Esto se hace así para que los datos estén disponibles fuera del módulo, por ejemplo
        // para hacer las migraciones con CLI
        configService.get('typeorm'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      // Aquí cargamos las variables de entorno
      load: [typeOrmConfig],
    }),
    userModule,
    todosModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: 'APP_GUARD',
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
// Path: src/app.module.ts

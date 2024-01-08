import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from 'src/users/users.module';
import config from '../../enviroments/typesEnviroments';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategyService } from './strategies/jwt.strategy.service';
import { LocalStrategyService } from './strategies/local.strategy.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // JwtModule.register({ // de forma directa
    //   secret: 'la llave secreta',
    //   signOptions: {
    //     expiresIn: '10d',
    //   },
    // }),

    // con variables de entorno
    JwtModule.registerAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jtwKey,
          signOptions: {
            expiresIn: '10d',
          },
        };
      },
      inject: [config.KEY],
    }),
  ],
  providers: [AuthService, LocalStrategyService, JwtStrategyService],
  controllers: [AuthController],
})
export class AuthModule {}

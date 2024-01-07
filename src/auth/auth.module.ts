import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './services/auth.service';
import { LocalStrategyService } from './strategies/local.strategy.service';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategyService],
  controllers: [AuthController],
})
export class AuthModule {}

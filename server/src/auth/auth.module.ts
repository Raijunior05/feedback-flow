import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../modules/users/users.module'; // Verifique o caminho
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // <-- ISSO CONECTA OS DOIS MÓDULOS
    JwtModule.register({
      global: true,
      secret: 'CHAVE_ULTRA_SECRETA_DO_DINHO',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
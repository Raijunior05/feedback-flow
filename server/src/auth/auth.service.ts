import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

async signIn(email: string, pass: string) {
  const user = await this.usersService.findByEmail(email);

  // Se o usuário não existir, barramos o acesso imediatamente
  if (!user) {
    throw new UnauthorizedException('Credenciais inválidas');
  }

  // Agora o TypeScript sabe que 'user' NÃO é null aqui
  const isMatch = await bcrypt.compare(pass, user.password);

  if (!isMatch) {
    throw new UnauthorizedException('Credenciais inválidas');
  }

  const payload = { sub: user.id, email: user.email };
  
  return {
    access_token: await this.jwtService.signAsync(payload),
  };
}
}
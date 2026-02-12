import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Pega o token do cabeçalho "Authorization: Bearer <TOKEN>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'CHAVE_ULTRA_SECRETA_DO_DINHO', // A mesma que você usou no AuthModule
    });
  }

  async validate(payload: any) {
    // O que retornarmos aqui ficará disponível no objeto 'req.user'
    return { userId: payload.sub, email: payload.email };
  }
}
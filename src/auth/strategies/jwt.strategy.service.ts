import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../../../enviroments/typesEnviroments';
import { PayloadToken } from '../models/token.models';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>, // así se inyecta directamente con variables de entorno
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // OBTENDREMOS EL TOKEN LOS HEADERS COMO 'Bearer token'
      ignoreExpiration: false, // IGNORA LA EXPIRACION, EN TU CASO EL TIEMPO QUE LE HAYAS PUESTO
      secretOrKey: configService.jtwKey, // el secreto para desencriptar
    });
  }

  // ESTA FUNCION LO QUE HARA SERA RECIBIR EL TOKEN DECODIFICADO
  // CON LA CARGA DE DATOS QUE LE PUSIMOS AL HACER LOGIN
  validate(payload: PayloadToken) {
    // expone el role y el sub para usar
    return payload;
  }
}

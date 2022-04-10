import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from "@prisma/client";
import {PrismaService} from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private prisma:PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ){}

  public async signup(authDto){
    const hash = await argon.hash(authDto.password);
    try{
      const user = await this.prisma.user.create({
        data:{
          email: authDto.email,
          hash
        }
      });
      return this.signToken(user.id, user.email);
    }catch(error){
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }

  }

  public async signin(authDto){
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if(!user) {
      throw new Error('user not match');
    }
    const pwMatches = await argon.verify(
      user.hash,
      authDto.password,
    );
    if(!pwMatches) {
      throw new Error('incorrect password');
    }
    return this.signToken(user.id, user.email);
  }

  private async signToken(userId: number, email: string,): Promise<{ access_token: string }> {
   const payload = { sub: userId, email };
   const secret = this.config.get('JWT_SECRET');
   const token = await this.jwt.signAsync(
     payload,
     {
       expiresIn: '15m',
       secret: secret,
     },
   );
   return {
     access_token: token,
   };
  }

}

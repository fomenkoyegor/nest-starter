import { Injectable } from '@nestjs/common';
import { User } from "@prisma/client";
import {PrismaService} from '../prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {

  constructor(
    private prisma:PrismaService
  ){}

  public async signup(authDto){
    const hash = await argon.hash(authDto.password);
    const user = await this.prisma.user.create({
      data:{
        email: authDto.email,
        hash
      }
    })
    return {
      ...authDto,
      hash,
      msg:"login",
      user
    };
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
    return {
      ...authDto,
      msg:"register",
      user
    };
  }

}

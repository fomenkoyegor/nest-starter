import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { AuthDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ){}

  @Post('signin')
  signin(@Body() authDto: AuthDto){
    return this.authService.signin(authDto);
  }

  @Post('signup')
  signup(@Body() userDTO){
    return this.authService.signup(userDTO);
  }
}

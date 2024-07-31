import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@Controller('/login')
export class LoginController {
  constructor(private loginService: LoginService) {}
  @Post()
  async login(@Body() loginData: LoginDto) {
    await this.loginService.login(loginData);
    // console.log(loginData);
  }
}

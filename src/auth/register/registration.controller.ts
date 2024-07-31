import { Body, Controller, Inject, Post } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('/register')
export class RegistrationController {
  constructor(
    @Inject(RegistrationService)
    private registrationService: RegistrationService,
  ) {}
  @Post()
  async register(@Body() data: RegisterUserDto) {
    await this.registrationService.register(data);
  }
}

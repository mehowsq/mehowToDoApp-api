import { Body, Controller, Inject, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegistrationService } from './registration.service';

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

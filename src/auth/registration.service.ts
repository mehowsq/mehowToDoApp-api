import { Inject } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersRepository } from './users.repository';
import { v4 } from 'uuid';

export class RegistrationService {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async register(data: RegisterUserDto) {
    const newUser = {
      id: v4(),
      email: data.email,
      password: data.password,
    };
    await this.usersRepository.insert(newUser);
  }
}

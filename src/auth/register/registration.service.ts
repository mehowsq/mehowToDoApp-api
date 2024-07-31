import { Inject } from '@nestjs/common';
import { v4 } from 'uuid';
import { UsersRepository } from '../users.repository';
import { RegisterUserDto } from './dto/register-user.dto';

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

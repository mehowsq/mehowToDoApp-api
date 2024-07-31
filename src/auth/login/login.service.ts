import {
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../users.repository';
import { LoginDto } from './dto/login.dto';

export class LoginService {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}
  async login(loginData: LoginDto) {
    const user = await this.usersRepository.findOne(loginData.email);
    if (user === undefined) {
      throw new BadRequestException();
    }
    if (loginData.password !== user.password) {
      throw new UnauthorizedException('Wrong email or password');
    }
  }
}

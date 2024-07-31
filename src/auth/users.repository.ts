import { Pool } from 'pg';
import { Inject, BadRequestException } from '@nestjs/common';

interface NewUser {
  id: string;
  email: string;
  password: string;
}

export class UsersRepository {
  constructor(@Inject('PgPool') private pool: Pool) {}
  async insert(user: NewUser) {
    try {
      await this.pool.query(
        `INSERT INTO users (id, email, password) VALUES ($1, $2, $3)`,
        [user.id, user.email, user.password],
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }
}

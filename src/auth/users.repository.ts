import { Pool } from 'pg';
import { Inject, BadRequestException } from '@nestjs/common';

const uniqueViolation = '23505';
interface NewUser {
  id: string;
  email: string;
  password: string;
}
interface User {
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
      if (error.code === uniqueViolation) {
        throw new BadRequestException('Email already exists');
      }
      throw new BadRequestException();
    }
  }
  async findOne(email: string): Promise<undefined | User> {
    const response = await this.pool.query(
      `SELECT * FROM public.users WHERE email = $1`,
      [email],
    );
    console.log(response.rows[0]);
    return response.rows[0];
  }
}

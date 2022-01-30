import { TJWTPayload, TAccessToken } from './types/jwt.type';
import { User } from './../users/schemas/user.schema';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly UsersService: UsersService,
    private readonly JwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, '_passwordHash'> | null> {
    const user = await this.UsersService.findUserForAuth({ email });
    const passwordIsEqual = await argon2.verify(
      `${user._passwordHash}`,
      password,
    );

    if (user && passwordIsEqual) {
      const { _passwordHash, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: Omit<User, '_passwordHash'>): Promise<TAccessToken> {
    const payload: TJWTPayload = { email: user.email, sub: user._id };

    return {
      access_token: this.JwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}

import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { UserInput } from 'src/users/inputs/user.input';
import { UsersService } from 'src/users/users.service';
import argon2 from 'argon2';
import { AuthLoginInput } from './inputs/AuthLoginInput';
import { randomBytes } from 'crypto';

export interface JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async login(userInput: AuthLoginInput) {
    const user = await this.em
      .findOneOrFail(User, { email: userInput.email })
      .catch(() => {
        throw new BadRequestException('Invalid credentials');
      });

    if (user.status === UserStatus.PENDING_VERIFICATION) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      userInput.password,
    );

    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const accessToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '15m' },
    );

    const refreshToken = randomBytes(64).toString('hex');

    user.refreshToken = await argon2.hash(refreshToken);

    await this.em.persistAndFlush(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
      },
      accessToken,
      refreshToken,
    };
  }

  async registerUser(userInput: UserInput) {
    await this.em.findOneOrFail(User, { email: userInput.email }).catch(() => {
      throw new BadRequestException('Email already in use');
    });

    const hashedPassword = await argon2.hash(userInput.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 13,
      timeCost: 3,
      parallelism: 1,
    });

    const emailVerificationToken = randomBytes(32).toString('hex');

    userInput.password = hashedPassword;
    userInput.emailVerificationToken = emailVerificationToken;

    await this.usersService.save(userInput);

    // TODO: Enviar email de verificação
    // await this.emailService.sendVerificationEmail(userInput.email, emailVerificationToken);

    return {
      message:
        'User registered successfully. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.em.findOne(User, {
      emailVerificationToken: token,
      status: UserStatus.PENDING_VERIFICATION,
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = null;
    user.status = UserStatus.ACTIVE;

    await this.em.persistAndFlush(user);

    const accessToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '15m' },
    );

    const refreshToken = randomBytes(64).toString('hex');
    user.refreshToken = await argon2.hash(refreshToken);
    await this.em.persistAndFlush(user);

    return {
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string, userId: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    const user = await this.em.findOne(User, {
      id: userId,
      status: UserStatus.ACTIVE,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('No refresh token found for user');
    }

    const isRefreshTokenValid = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '15m' },
    );

    const newRefreshToken = randomBytes(64).toString('hex');
    user.refreshToken = await argon2.hash(newRefreshToken);
    await this.em.persistAndFlush(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    const user = await this.em.findOne(User, { id: userId });
    if (user) {
      user.refreshToken = null;
      await this.em.persistAndFlush(user);
    }
    return { message: 'Logged out successfully' };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.em.findOneOrFail(User, {
      id: payload.id,
      status: UserStatus.ACTIVE,
    });
  }
}

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
import { MailService } from 'src/mail/mail.service';

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
    private readonly mailService: MailService,
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
        username: user.username,
        status: user.status,
      },
      accessToken,
      refreshToken,
    };
  }

  async registerUser(userInput: UserInput) {
    if (!userInput.password) {
      throw new BadRequestException('Password is required');
    }

    if (!userInput.email) {
      throw new BadRequestException('Email is required');
    }

    const existingEmail = await this.em.findOne(User, {
      email: userInput.email,
    });

    if (existingEmail) throw new BadRequestException('Email already in use');

    const existingUsername = await this.em.findOne(User, {
      username: userInput.username,
    });

    if (existingUsername)
      throw new BadRequestException('Username already in use');

    const hashedPassword = await argon2.hash(userInput.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 13,
      timeCost: 3,
      parallelism: 1,
    });

    const emailVerificationToken = randomBytes(32).toString('hex');

    userInput.password = hashedPassword;
    userInput.emailVerificationToken = emailVerificationToken;

    const user = await this.usersService.save(userInput);

    await this.mailService.sendVerificationEmail(
      userInput.email,
      userInput.username,
      emailVerificationToken,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      message:
        'User registered successfully. Please check your email to verify your account.',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.em.findOne(User, { email });

    if (!user) throw new BadRequestException('User not found');

    const resetToken = randomBytes(32).toString('hex');

    const resetExpiry = new Date();
    resetExpiry.setHours(resetExpiry.getHours() + 1);

    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = resetExpiry;

    await this.em.persistAndFlush(user);

    await this.mailService.sendForgotPasswordEmail(
      user.email,
      user.username,
      resetToken,
    );
    return { message: 'Recovery email sent successfully' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.em.findOne(User, {
      passwordResetToken: token,
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    const hashedPassword = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 13,
      timeCost: 3,
      parallelism: 1,
    });

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;

    await this.em.persistAndFlush(user);

    return { message: 'Password reset successfully' };
  }

  async verifyEmail(token: string) {
    const user = await this.em.findOne(User, {
      emailVerificationToken: token,
      status: UserStatus.PENDING_VERIFICATION,
    });

    if (!user)
      throw new BadRequestException('Invalid or expired verification token');

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
        username: user.username,
        status: user.status,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string, userId: string) {
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token is required');

    if (!userId) throw new UnauthorizedException('User ID is required');

    const user = await this.em.findOne(User, {
      id: userId,
      status: UserStatus.ACTIVE,
    });

    if (!user) throw new UnauthorizedException('User not found');

    if (!user.refreshToken)
      throw new UnauthorizedException('No refresh token found for user');

    const isRefreshTokenValid = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokenValid)
      throw new UnauthorizedException('Invalid refresh token');

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

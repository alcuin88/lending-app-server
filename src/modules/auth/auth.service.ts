import { ForbiddenException, Injectable } from '@nestjs/common';

import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TOKEN_EXPIRATION } from 'src/common';
import { PrismaService } from 'src/prisma';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async singup(dto: AuthDto) {
    try {
      const password = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: password,
        },
        select: {
          user_id: true,
          email: true,
        },
      });
      return this.signToken(user.user_id, user.email);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Credentials taken.');
        }
      }
      throw e;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user || user === null) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const pwMatch = await argon.verify(user.password, dto.password);
    if (!pwMatch) {
      throw new ForbiddenException('Credentials incorrect');
    }
    return await this.signToken(user.user_id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string; expires_in: number; email: string }> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET') as string;
    const expire = TOKEN_EXPIRATION;
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: expire,
        secret: secret,
      }),
      expires_in: expire,
      email,
    };
  }
}

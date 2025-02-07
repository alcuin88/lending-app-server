import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ResetPasswordDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async resetPassword(userId: number, dto: ResetPasswordDto) {
    const password = await argon.hash(dto.password);
    try {
      await this.prisma.user.update({
        where: {
          user_id: userId,
        },
        data: {
          password: password,
        },
      });
    } catch {
      throw new Error('Failed to update password');
    }
  }
}

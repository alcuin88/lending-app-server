import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { LoanDto } from './dto';

@Injectable()
export class LoanService {
  constructor(private prisma: PrismaService) {}

  async addLoan(loan: LoanDto, user_id: number) {
    try {
      return await this.prisma.loan.create({
        data: {
          amount: loan.amount,
          balance: loan.balance,
          purpose: loan.purpose,
          user_id: user_id,
          client_id: loan.client_id,
        },
        select: {
          client_id: true,
        },
      });
    } catch {
      throw new Error('Failed to fetch records.');
    }
  }
}

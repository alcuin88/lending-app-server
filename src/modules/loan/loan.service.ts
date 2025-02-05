import { Injectable } from '@nestjs/common';
import { LoanDto } from './dto';
import { PrismaService } from '../../prisma';

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

  async getLoan(loan_id: number) {
    try {
      return await this.prisma.loan.findFirst({
        where: {
          loan_id,
        },
      });
    } catch {
      throw new Error(`Failed to fetch loan with loan_id: ${loan_id}`);
    }
  }
}

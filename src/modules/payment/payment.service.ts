import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { PaymentDto } from './dto';
import { Payment } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private primsa: PrismaService) {}

  async payment(dto: PaymentDto, userId: number) {
    if (dto.loan_id === 0) {
      return this.generalPayment(dto, userId);
    }

    const payment: Payment = {
      amount: dto.amount,
      remarks: dto.remarks,
      loan_id: dto.loan_id,
      client_id: dto.client_id,
      payment_id: 0,
      created_at: dto.created_at,
    };

    await this.postPayment(payment);
  }

  async generalPayment(dto: PaymentDto, userId: number) {
    const loans = await this.getLoans(dto.client_id, userId);
    let remainingAmount = dto.amount;
    let newPayment: Payment = {
      ...dto,
      payment_id: 0,
    };

    for (const loan of loans) {
      if (remainingAmount > loan.balance) {
        newPayment = {
          ...newPayment,
          loan_id: loan.loan_id,
          amount: loan.balance,
        };
      } else {
        newPayment = {
          ...newPayment,
          loan_id: loan.loan_id,
          amount: remainingAmount,
        };
      }

      remainingAmount = remainingAmount - loan.balance;

      await this.postPayment(newPayment);

      if (remainingAmount <= 0) {
        break;
      }
    }
  }

  async postPayment(payment: Payment) {
    try {
      await this.primsa.payment.create({
        data: {
          amount: payment.amount,
          remarks: payment.remarks,
          client_id: payment.client_id,
          loan_id: payment.loan_id,
          created_at: payment.created_at,
        },
      });
    } catch {
      throw new Error('Error posting payment.');
    }
  }

  async getLoans(clientId: number, userId: number) {
    try {
      const loans = await this.primsa.loan.findMany({
        where: {
          user_id: userId,
          client_id: clientId,
        },
      });
      return loans.sort(
        (loan_a, loan_b) =>
          loan_a.created_at.getTime() - loan_b.created_at.getTime(),
      );
    } catch {
      throw new Error('Failed to fetch loan records.');
    }
  }

  async getPaymentsByLoanID(loan_id: number) {
    try {
      return await this.primsa.payment.findMany({
        where: {
          loan_id: loan_id,
        },
      });
    } catch {
      throw new Error(`Failed to fetch payment with loan_id: ${loan_id}`);
    }
  }
}

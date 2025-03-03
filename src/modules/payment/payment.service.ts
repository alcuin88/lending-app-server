import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentDto } from './dto';
import { Loan, Payment } from '@prisma/client';
import { PrismaService } from '../../prisma';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

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
      status: 'Active',
    };

    const loan = (await this.getLoan(payment.loan_id)) as Loan;

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    if (loan.status !== 'Active') {
      throw new BadRequestException('Loan already paid.');
    }

    if (loan.balance < payment.amount) {
      throw new BadRequestException('Over payment is not allowed.');
    }

    const res = await this.postPayment(payment, loan);
    console.log(res);
    return res;
  }

  async generalPayment(dto: PaymentDto, userId: number) {
    const loans = await this.getLoans(dto.client_id, userId);
    let remainingAmount = dto.amount;
    let newPayment: Payment = {
      ...dto,
      payment_id: 0,
      status: 'Active',
    };

    if (this.isOverPayment(loans, dto.amount)) {
      throw new BadRequestException('Over payment is not allowed.');
    }

    const processedPayments = [];

    for (const loan of loans) {
      if (remainingAmount <= 0) break; // Stop processing if no money left

      const paymentAmount = Math.min(remainingAmount, loan.balance);

      newPayment = {
        ...newPayment,
        loan_id: loan.loan_id,
        amount: paymentAmount, // Use the correct amount
      };

      remainingAmount -= paymentAmount; // Subtract the actual paid amount

      const paymentResponse = await this.postPayment(newPayment, loan);
      processedPayments.push(paymentResponse);
    }

    return {
      message: 'Payment posted successfully',
    };
  }

  async postPayment(payment: Payment, loan: Loan) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        await prisma.payment.create({
          data: {
            amount: payment.amount,
            remarks: payment.remarks,
            client_id: payment.client_id,
            loan_id: payment.loan_id,
            created_at: payment.created_at,
          },
        });

        loan.balance = loan.balance - payment.amount;

        loan.status = loan.balance === 0 ? 'Paid' : 'Active';
        loan.closed_at = loan.balance === 0 ? payment.created_at : null;
        await this.updateLoan(loan);
        return { message: 'Payment posted successfully' };
      });
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new HttpException(
        { message: 'Failed to create payment' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  isOverPayment(loans: Loan[], paymentAmount: number) {
    const amount = loans.reduce(
      (totalLoanAmount, loan) => totalLoanAmount + loan.balance,
      0,
    );

    return amount < paymentAmount;
  }

  async updateLoan(loan: Loan) {
    try {
      await this.prisma.loan.update({
        where: {
          loan_id: loan.loan_id,
        },
        data: {
          balance: loan.balance,
          status: loan.status,
          closed_at: loan.closed_at,
        },
      });
    } catch {
      throw new Error('Error updating loan.');
    }
  }

  async getLoan(loan_id: number) {
    try {
      return await this.prisma.loan.findUnique({
        where: {
          loan_id: loan_id,
        },
      });
    } catch {
      throw new Error('Error fetching loan.');
    }
  }

  async getLoans(clientId: number, userId: number) {
    try {
      const loans = await this.prisma.loan.findMany({
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
      return await this.prisma.payment.findMany({
        where: {
          loan_id: loan_id,
        },
      });
    } catch {
      throw new Error(`Failed to fetch payment with loan_id: ${loan_id}`);
    }
  }
}

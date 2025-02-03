import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/common/guard';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto';
import { UserDecorator } from 'src/common/decorator';
import { User } from '@prisma/client';
import { LoanIDDto } from '../loan/dto';

@UseGuards(JwtGuard)
@Controller('payment')
export class PaymentController {
  constructor(private service: PaymentService) {}

  @HttpCode(HttpStatus.OK)
  @Post('new')
  async createPayment(@Body() dto: PaymentDto, @UserDecorator() user: User) {
    return this.service.payment(dto, user.user_id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('id')
  async getPaymentByID(@Body() loanIDDto: LoanIDDto) {
    return this.service.getPaymentsByLoanID(loanIDDto.loan_id);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto';
import { User } from '@prisma/client';
import { JwtGuard, UserDecorator } from '../../common';

@UseGuards(JwtGuard)
@Controller('payment')
export class PaymentController {
  constructor(private service: PaymentService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('new')
  async createPayment(@Body() dto: PaymentDto, @UserDecorator() user: User) {
    return await this.service.payment(dto, user.user_id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getPaymentByID(@Param('id') loan_id: string) {
    console.log('/payment/:id');
    return this.service.getPaymentsByLoanID(Number(loan_id));
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoanDto } from './dto';
import { LoanService } from './loan.service';
import { User } from '@prisma/client';
import { JwtGuard, UserDecorator } from '../../common';

@UseGuards(JwtGuard)
@Controller('loan')
export class LoanController {
  constructor(private loanService: LoanService) {}

  @HttpCode(HttpStatus.OK)
  @Post('new')
  async newLoan(@Body() dto: LoanDto, @UserDecorator() user: User) {
    return this.loanService.addLoan(dto, user.user_id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getLoan(@Param('id') loan_id: string) {
    console.log('/loan/:id');
    return this.loanService.getLoan(Number(loan_id));
  }

  @HttpCode(HttpStatus.OK)
  @Patch('delete/:id')
  deleteLoan(@Param('id') loan_id: string) {
    return this.loanService.deleteLoan(Number(loan_id));
  }
}

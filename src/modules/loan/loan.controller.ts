import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoanDto, LoanIDDto } from './dto';
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
  @Post('id')
  async getLoan(@Body() loanIDDto: LoanIDDto) {
    return this.loanService.getLoan(loanIDDto.loan_id);
  }
}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoanDto } from './dto';
import { LoanService } from './loan.service';
import { UserDecorator } from 'src/common/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/common/guard';

@UseGuards(JwtGuard)
@Controller('loan')
export class LoanController {
  constructor(private loanService: LoanService) {}

  @HttpCode(HttpStatus.OK)
  @Post('new')
  async newLoan(@Body() dto: LoanDto, @UserDecorator() user: User) {
    return this.loanService.addLoan(dto, user.user_id);
  }
}

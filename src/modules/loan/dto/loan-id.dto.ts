import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class LoanIDDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  loan_id: number;

  constructor(loan_id: number) {
    this.loan_id = loan_id;
  }
}

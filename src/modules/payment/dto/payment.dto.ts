import { Type } from 'class-transformer';
import {
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsDate,
} from 'class-validator';

export class PaymentDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsString()
  remarks: string;

  @IsNumber()
  @Type(() => Number)
  loan_id: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  created_at: Date;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  client_id: number;

  constructor(
    amount: number,
    remarks: string,
    loan_id: number,
    client_id: number,
    created_at: Date,
  ) {
    this.amount = amount;
    this.remarks = remarks;
    this.loan_id = loan_id;
    this.client_id = client_id;
    this.created_at = created_at;
  }
}

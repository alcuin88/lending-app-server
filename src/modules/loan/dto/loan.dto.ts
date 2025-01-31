import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class LoanDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  balance: number;

  @IsString()
  purpose: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  client_id: number;

  constructor(
    amount: number,
    balance: number,
    purpose: string,
    client_id: number,
  ) {
    this.amount = amount;
    this.balance = balance;
    this.purpose = purpose;
    this.client_id = client_id;
  }
}

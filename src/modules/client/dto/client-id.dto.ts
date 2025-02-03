import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ClientIDDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  client_id: number;

  constructor(client_id: number) {
    this.client_id = client_id;
  }
}

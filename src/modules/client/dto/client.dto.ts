import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ClientDto {
  @IsNumber()
  client_id?: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  constructor(first_name: string, last_name: string, client_id: number) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.client_id = client_id;
  }
}

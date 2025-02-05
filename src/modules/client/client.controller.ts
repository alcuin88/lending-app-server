import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { User } from '@prisma/client';
import { ClientDto, ClientIDDto } from './dto';
import { JwtGuard, UserDecorator } from '../../common';

@UseGuards(JwtGuard)
@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @HttpCode(HttpStatus.OK)
  @Get('all')
  getAllClients(@UserDecorator() user: User) {
    console.log(user);
    return this.clientService.getAllClients(user.user_id);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  getClientByName(@Body() dto: ClientDto) {
    return this.clientService.getClientByName(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  createClient(@Body() dto: ClientDto, @UserDecorator() user: User) {
    console.log(user);
    return this.clientService.createClient(dto, user.user_id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('id')
  getClientByID(@Body() clientIDDto: ClientIDDto) {
    return this.clientService.getClientByID(clientIDDto.client_id);
  }
}

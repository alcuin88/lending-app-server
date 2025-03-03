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
import { ClientService } from './client.service';
import { User } from '@prisma/client';
import { ClientDto } from './dto';
import { JwtGuard, UserDecorator } from '../../common';

@UseGuards(JwtGuard)
@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @HttpCode(HttpStatus.OK)
  @Get('all')
  getAllClients(@UserDecorator() user: User) {
    console.log('/client/all');
    return this.clientService.getAllClients(user.user_id);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  getClientByName(@Body() dto: ClientDto, @UserDecorator() user: User) {
    console.log('/client');
    return this.clientService.getClientByNameUnderUser(dto, user.user_id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  createClient(@Body() dto: ClientDto, @UserDecorator() user: User) {
    return this.clientService.createClient(dto, user.user_id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getClientByID(@Param('id') client_id: string) {
    console.log('/client/:id');
    return this.clientService.getClientByID({ client_id: Number(client_id) });
  }

  @Patch()
  updateClient(@Body() dto: ClientDto, @UserDecorator() user: User) {
    return this.clientService.updateClient(dto, user.user_id);
  }
}

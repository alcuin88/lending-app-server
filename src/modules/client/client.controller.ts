import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtGuard } from 'src/common/guard';
import { User } from '@prisma/client';
import { UserDecorator } from 'src/common/decorator';
import { ClientDto, ClientIDDto } from './dto';

@UseGuards(JwtGuard)
@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get('all')
  getAllClients(@UserDecorator() user: User) {
    return this.clientService.getAllClients(user.user_id);
  }

  @Post()
  getClientByName(@Body() dto: ClientDto) {
    return this.clientService.getClientByName(dto);
  }

  @Post('create')
  createClient(@Body() dto: ClientDto, @UserDecorator() user: User) {
    return this.clientService.createClient(dto, user.user_id);
  }

  @Post('id')
  getClientByID(@Body() clientIDDto: ClientIDDto) {
    return this.clientService.getClientByID(clientIDDto.client_id);
  }
}

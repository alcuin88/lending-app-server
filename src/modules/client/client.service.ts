import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ClientDto } from './dto';

@Injectable()
export class ClientService {
  [x: string]: any;
  constructor(private prisma: PrismaService) {}

  async getAllClients(userId: number) {
    try {
      return await this.prisma.client.findMany({
        where: { user_id: userId },
        include: {
          loans: true,
          payments: true,
        },
      });
    } catch {
      throw new Error('Failed to fetch records.');
    }
  }

  async getClientByName(dto: ClientDto) {
    try {
      return await this.prisma.client.findFirst({
        where: {
          first_name: dto.first_name,
          last_name: dto.last_name,
        },
      });
    } catch {
      throw new Error('Failed to fetch records.');
    }
  }

  async createClient(dto: ClientDto, userId: number) {
    try {
      return await this.prisma.client.create({
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          user_id: userId,
        },
        select: {
          client_id: true,
        },
      });
    } catch {
      throw new Error('Failed to create new client.');
    }
  }
}

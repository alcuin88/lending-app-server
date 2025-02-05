import { Injectable } from '@nestjs/common';
import { ClientDto } from './dto';
import { PrismaService } from '../../prisma';

@Injectable()
export class ClientService {
  [x: string]: any;
  constructor(private prisma: PrismaService) {}

  async getAllClients(userId: number) {
    try {
      const response = await this.prisma.client.findMany({
        where: { user_id: userId },
        include: {
          loans: true,
          payments: true,
        },
      });
      return response;
    } catch {
      throw new Error('Failed to fetch records.');
    }
  }

  async getClientByName(dto: ClientDto) {
    try {
      const response = await this.prisma.client.findFirst({
        where: {
          first_name: dto.first_name,
          last_name: dto.last_name,
        },
      });

      return response;
    } catch {
      throw new Error('Failed to fetch records.');
    }
  }

  async getClientByID(client_id: number) {
    try {
      const response = await this.prisma.client.findFirst({
        where: {
          client_id: client_id,
        },
      });

      return response;
    } catch {
      throw new Error(`Failed to fetch client with client_id: ${client_id}`);
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

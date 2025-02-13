import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientDto } from './dto';
import { PrismaService } from '../../prisma';
import { Client, Prisma } from '@prisma/client';

@Injectable()
export class ClientService {
  [x: string]: any;
  constructor(private prisma: PrismaService) {}

  async getAllClients(user_id: number) {
    try {
      const response = await this.prisma.client.findMany({
        where: {
          user: {
            some: {
              user_id: user_id,
            },
          },
        },
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

  async getClientByNameUnderUser(dto: ClientDto, user_id: number) {
    try {
      const response = await this.prisma.client.findFirst({
        where: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          user: {
            some: {
              user_id: user_id,
            },
          },
        },
      });

      return response;
    } catch {
      throw new Error('Failed to fetch records.');
    }
  }

  async getClientByID(
    clientWhereUniqueInput: Prisma.ClientWhereUniqueInput,
  ): Promise<Client | null> {
    try {
      const response = await this.prisma.client.findUnique({
        where: clientWhereUniqueInput,
      });

      return response;
    } catch {
      throw new Error(
        `Failed to fetch client with client_id: ${clientWhereUniqueInput.client_id}`,
      );
    }
  }

  async updateClient(dto: ClientDto, user_id: number) {
    const client = await this.isClientExist(Number(dto.client_id));
    if (client === null) {
      throw new NotFoundException('Client not found.');
    }
    try {
      return await this.prisma.client.update({
        where: {
          client_id: dto.client_id,
        },
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          user: {
            connect: {
              user_id: user_id,
            },
          },
        },
      });
    } catch {
      throw new Error('Failed to create new client.');
    }
  }

  async createClient(dto: ClientDto, user_id: number) {
    const client = await this.getClientIdByName(dto);
    if (client !== null) {
      return await this.updateClient(dto, user_id);
    }
    try {
      return await this.prisma.client.create({
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          user: {
            connect: {
              user_id: user_id,
            },
          },
        },
        select: {
          client_id: true,
        },
      });
    } catch {
      throw new Error('Failed to create new client.');
    }
  }

  async getClientIdByName(dto: ClientDto) {
    try {
      return await this.prisma.client.findFirst({
        where: {
          first_name: dto.first_name,
          last_name: dto.last_name,
        },
        select: {
          client_id: true,
        },
      });
    } catch {
      throw new Error('Failed to fetch client.');
    }
  }

  async isClientExist(client_id: number) {
    try {
      return await this.prisma.client.findFirst({
        where: {
          client_id: client_id,
        },
      });
    } catch {
      throw new Error('Failed to fetch client.');
    }
  }
}

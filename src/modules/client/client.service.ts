import { Injectable } from '@nestjs/common';
import { ClientDto } from './dto';
import { PrismaService } from '../../prisma';

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

  async clientCreateUpdate(dto: ClientDto, user_id: number) {
    const client = await this.isClientExist(dto);
    if (client === null) {
      return await this.createClient(dto, user_id);
    } else {
      return await this.updateClient(client.client_id, user_id);
    }
  }

  async updateClient(client_id: number, user_id: number) {
    try {
      return await this.prisma.client.update({
        where: {
          client_id: client_id,
        },
        data: {
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

  async isClientExist(dto: ClientDto) {
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
}

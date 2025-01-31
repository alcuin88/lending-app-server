import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma/prisma.module';
import { LoanModule } from './modules/loan/loan.module';
import { ClientService } from './modules/client/client.service';
import { ClientController } from './modules/client/client.controller';
import { ClientModule } from './modules/client/client.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    LoanModule,
    ClientModule,
    PaymentModule,
  ],
  providers: [ClientService],
  controllers: [ClientController],
})
export class AppModule {}

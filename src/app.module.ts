import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoanModule } from './modules/loan/loan.module';
import { ClientModule } from './modules/client/client.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PrismaModule } from './prisma';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    LoanModule,
    ClientModule,
    PaymentModule,
  ],
})
export class AppModule {}

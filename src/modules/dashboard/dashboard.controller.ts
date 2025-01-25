import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetDashboardData } from 'src/common/decorator';
import { JwtGuard } from 'src/common/guard';

@UseGuards(JwtGuard)
@Controller('dashboard')
export class DashboardController {
  @Get()
  populateDashboard(@GetDashboardData() user: User) {
    return user;
  }
}

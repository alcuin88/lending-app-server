import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard, UserDecorator } from '../../common';
import { User } from '@prisma/client';
import { ResetPasswordDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  getUser(@UserDecorator() user: User) {
    return user;
  }

  @Patch()
  eidtUser(
    @UserDecorator('user_id') userId: number,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(userId, dto);
  }
}

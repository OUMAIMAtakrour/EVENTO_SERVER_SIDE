import {
  Controller,
  Put,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Post,
  Req,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
// import { Roles } from '../auth/roles.decorator';
import { User, UserRole } from 'src/schemas/user.schema';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/profile')
  async updateProfile(@Req() req, @Body() updateData: Partial<User>) {
    return this.userService.updateProfile(req.user.userId, updateData);
  }

  @Get('/profile')
  async getProfile(@Req() req) {
    console.log('User ID from token:', req.user.userId);

    return this.userService.getUserProfile(req.user.userId);
  }
  @Delete('account')
  async deleteAccount(@Req() req, @Body() { password }: { password: string }) {
    return this.userService.deleteAccount(req.user.userId, password);
  }

  @Get()
  @Roles(UserRole.ORGANIZER)
  async listUsers(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    console.log('Request User:', req.user);

    return this.userService.listUsers(req.user.role, page, limit);
  }

  @Post('logout')
  async logout(@Request() req) {
    return this.userService.logout(req.user.userId);
  }
}

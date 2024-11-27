import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async updateProfile(userId: string, updateData: Partial<User>) {
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedUser = await this.UserModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true },
      ).select({ password: 0 });

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid user ID');
      }
      throw new BadRequestException('Could not update profile');
    }
  }

  async deleteAccount(userId: string, password: string) {
    const user = await this.UserModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    await this.UserModel.findByIdAndDelete(userId);

    return { message: 'Account deleted successfully' };
  }

  async getUserProfile(userId: string) {
    try {
      const user =
        await this.UserModel.findById(userId).select('-password -__v');

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      console.error('Get Profile Error:', error);

      if (error.name === 'CastError') {
        throw new NotFoundException('Invalid user ID');
      }

      throw new BadRequestException('Could not retrieve user profile');
    }
  }

  async listUsers(currentUserRole: UserRole, page = 1, limit = 10) {
    console.log('Current User Role:', currentUserRole); 
    if (currentUserRole !== UserRole.ORGANIZER) {
      throw new UnauthorizedException('Not authorized to list users');
    }

    const users = await this.UserModel.find()
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.UserModel.countDocuments();

    return {
      users,
      totalUsers: total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async logout(userId: string) {
    return { message: 'Logged out successfully' };
  }
}

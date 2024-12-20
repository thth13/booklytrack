import { Request } from 'express';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token';

@Injectable()
export class UserService {
  LOGIN_ATTEMPTS_TO_BLOCK = 10;
  HOURS_TO_BLOCK = 6;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(CreateUserDto);
    await this.isEmailUnique(user.email);

    await user.save();
    return this.buildRegistreationInfo(user);
  }

  async login(req: Request, loginUserDto: LoginUserDto) {
    const user = await this.findUserByEmail(loginUserDto.email);
    await this.checkPassword(loginUserDto.password, user);
    await this.passwordsAreMatch(user);

    return {
      userName: user.userName,
      email: user.email,
      accessToken: await this.authService.createAccessToken(user._id),
      refreshToken: await this.authService.createRefreshToken(req, user._id),
    };
  }

  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const userId = await this.authService.findRefreshToken(
      refreshAccessTokenDto.refreshToken,
    );
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('Bad request');
    }

    return {
      accessToken: await this.authService.createAccessToken(user._id),
    };
  }

  // ********************************************
  // ╔═╗╦═╗╦╦  ╦╔═╗╔╦╗╔═╗  ╔╦╗╔═╗╔╦╗╦ ╦╔═╗╔╦╗╔═╗
  // ╠═╝╠╦╝║╚╗╔╝╠═╣ ║ ║╣   ║║║║╣  ║ ╠═╣║ ║ ║║╚═╗
  // ╩  ╩╚═╩ ╚╝ ╩ ╩ ╩ ╚═╝  ╩ ╩╚═╝ ╩ ╩ ╩╚═╝═╩╝╚═╝
  // ********************************************

  private async isEmailUnique(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException('Email most be unique.');
    }
  }

  private buildRegistreationInfo(user: User): any {
    const userRegistrationInfo = {
      userName: user.userName,
      email: user.email,
    };

    return userRegistrationInfo;
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Wrong email or password.');
    }
    return user;
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Email not found.');
    }

    return user;
  }

  private async checkPassword(attemptPass: string, user: User) {
    const match = await bcrypt.compare(attemptPass, user.password);

    if (!match) {
      await this.passwordsDoNotMatch(user);
      throw new NotFoundException('Wrong email or password.');
    }

    return match;
  }

  private async passwordsDoNotMatch(user: User) {
    user.loginAttempts += 1;
    await user.save();
    if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
      await this.blockUser(user);
      throw new ConflictException('Too many attempts. User blocked.');
    }
  }

  private async blockUser(user: User) {
    user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
    await user.save();
  }

  private async passwordsAreMatch(user: User) {
    user.loginAttempts = 0;
    await user.save();
  }

  // checkPassword
  // passwordAreMatch
}

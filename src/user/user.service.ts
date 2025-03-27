import { Request } from 'express';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { ForgotPassword } from './interfaces/forgot-password.interface';
import { v4 } from 'uuid';
import { VerifyUuidDto } from './dto/verify-uuid.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Profile } from 'src/profile/interfaces/profile.interface';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  HOURS_TO_VERIFY = 4;
  LOGIN_ATTEMPTS_TO_BLOCK = 10;
  HOURS_TO_BLOCK = 6;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
    @InjectModel('ForgotPassword')
    private readonly forgotPasswordModel: Model<ForgotPassword>,
    private readonly authService: AuthService,
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(CreateUserDto);
    await this.isEmailUnique(user.email);
    const profile = new this.profileModel({ user: user.id });

    await profile.save();
    await user.save();
    return this.buildRegistreationInfo(user);
  }

  async login(req: Request, loginUserDto: LoginUserDto) {
    const user = await this.findUserByEmail(loginUserDto.email);
    await this.checkPassword(loginUserDto.password, user);
    await this.passwordsAreMatch(user);

    return {
      id: user._id,
      login: user.login,
      email: user.email,
      accessToken: await this.authService.createAccessToken(user._id),
      refreshToken: await this.authService.createRefreshToken(req, user._id),
    };
  }

  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const userId = await this.authService.findRefreshToken(refreshAccessTokenDto.refreshToken);
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('Bad request');
    }

    return {
      accessToken: await this.authService.createAccessToken(user._id),
    };
  }

  async forgotPassword(req: Request, createForgotPasswordDto: CreateForgotPasswordDto) {
    await this.findByEmail(createForgotPasswordDto.email);
    await this.saveForgotPassword(req, createForgotPasswordDto);

    return {
      email: createForgotPasswordDto.email,
      message: 'verification sent',
    };
  }

  async forgotPasswordVerify(req: Request, verifyUuidDto: VerifyUuidDto) {
    const forgotPassword = await this.findForgotPasswordByUuid(verifyUuidDto);
    await this.setForgotPasswordFirstUser(req, forgotPassword);

    return {
      email: forgotPassword.email,
      message: 'Now reset your password',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const forgotPassword = await this.findForgotPasswordByEmail(resetPasswordDto);
    await this.setForgotPasswordFinalUsed(forgotPassword);
    await this.resetUserPassword(resetPasswordDto);

    return {
      email: resetPasswordDto.email,
      message: 'password successfylly changed.',
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
      throw new BadRequestException({ email: 'Email most be unique' });
    }
  }

  private buildRegistreationInfo(user: User): any {
    const userRegistrationInfo = {
      login: user.login,
      email: user.email,
    };

    return userRegistrationInfo;
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Wrong email or password.');
    }
    return user;
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Email not found.');
    }

    return user;
  }

  private async checkPassword(attemptPass: string, user: User) {
    const match = await bcrypt.compare(attemptPass, user.password);

    if (!match) {
      throw new UnauthorizedException({
        email: 'Wrong email or password',
        password: 'Wrong email or password',
      });
    }

    return match;
  }

  // private async passwordsDoNotMatch(user: User) {
  //   user.loginAttempts += 1;
  //   await user.save();
  //   if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
  //     await this.blockUser(user);
  //     throw new ConflictException('Too many attempts. User blocked.');
  //   }
  // }

  private async blockUser(user: User) {
    user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
    await user.save();
  }

  private async passwordsAreMatch(user: User) {
    user.loginAttempts = 0;
    await user.save();
  }

  // TODO: send verify code to email
  private async saveForgotPassword(req: Request, createForgotPasswordDto: CreateForgotPasswordDto) {
    const forgotPassword = await this.forgotPasswordModel.create({
      email: createForgotPasswordDto.email,
      verification: v4(),
      expires: addHours(new Date(), this.HOURS_TO_VERIFY),
      ip: this.authService.getIp(req),
      browser: this.authService.getBrowserInfo(req),
      country: this.authService.getCountry(req),
    });

    await forgotPassword.save();
  }

  private async findForgotPasswordByUuid(verifyUuidDto: VerifyUuidDto): Promise<ForgotPassword> {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      verification: verifyUuidDto.verification,
      firstUsed: false,
      finalUsed: false,
      expired: { $gt: new Date() },
    });
    if (!forgotPassword) {
      throw new BadRequestException('Bad request.');
    }

    return forgotPassword;
  }

  private async setForgotPasswordFirstUser(req: Request, forgotPassword: ForgotPassword) {
    forgotPassword.firstUsed = true;
    forgotPassword.ipChanged = this.authService.getIp(req);
    forgotPassword.browserChanged = this.authService.getBrowserInfo(req);
    forgotPassword.countryChanged = this.authService.getCountry(req);

    await forgotPassword.save();
  }

  private async findForgotPasswordByEmail(resetPasswordDto: ResetPasswordDto): Promise<ForgotPassword> {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      email: resetPasswordDto.email,
      firstUsed: true,
      finalUsed: false,
      expires: { $gt: new Date() },
    });

    if (!forgotPassword) {
      throw new BadRequestException('Bad request.');
    }

    return forgotPassword;
  }

  private async setForgotPasswordFinalUsed(forgotPassword: ForgotPassword) {
    forgotPassword.finalUsed = true;
    await forgotPassword.save();
  }

  private async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: resetPasswordDto.email,
      verifed: true,
    });

    user.password = resetPasswordDto.password;
    await user.save();
  }

  // checkPassword
  // passwordAreMatch
}

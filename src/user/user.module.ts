import { Module } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ForgotPassword, ForgotPasswordSchema } from './schemas/forgot-password.schema';
import { ProfileModule } from 'src/profile/profile.module';
import { Profile, ProfileSchema } from 'src/profile/schemas/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: ForgotPassword.name, schema: ForgotPasswordSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

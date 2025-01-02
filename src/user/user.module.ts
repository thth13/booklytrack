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
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (next: (err?: Error) => void) {
            try {
              if (!this.isModified('password')) {
                return next();
              }

              // tslint:disable-next-line:no-string-literal
              const hashed = await bcrypt.hash(this['password'], 10);
              // tslint:disable-next-line:no-string-literal
              this['password'] = hashed;

              return next();
            } catch (err) {
              return next(err);
            }
          });
        },
      },
    ]),
    MongooseModule.forFeature([{ name: ForgotPassword.name, schema: ForgotPasswordSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

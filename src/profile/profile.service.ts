import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import { Model } from 'mongoose';
import { EditProfileDto } from './dto/edit-profile-dto';

@Injectable()
export class ProfileService {
  constructor(@InjectModel('Profile') private readonly profileModel: Model<Profile>) {}

  async editProfile(id: string, editProfileDto: EditProfileDto) {
    return await this.profileModel.updateOne({ _id: id }, editProfileDto);
  }

  async addBook() {}
  async addFollower() {}
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import { Model } from 'mongoose';
import { EditProfileDto } from './dto/edit-profile-dto';
import { ReadCategory } from 'src/types';

@Injectable()
export class ProfileService {
  constructor(@InjectModel('Profile') private readonly profileModel: Model<Profile>) {}

  async editProfile(id: string, editProfileDto: EditProfileDto) {
    return await this.profileModel.findOneAndUpdate({ user: id }, editProfileDto);
  }

  async getProfile(id: string): Promise<Profile> {
    return this.findProfileByUser(id);
  }

  async addReadBook(readCategory: ReadCategory, bookId: string, profileId: string) {
    return await this.profileModel.findOneAndUpdate({ _id: profileId }, { $push: { [readCategory]: bookId } });
  }

  async addFollower() {}

  private async findProfileByUser(id: string): Promise<Profile> {
    try {
      return await this.profileModel.findOne({ user: id });
    } catch (err) {
      throw new NotFoundException('Profile not found.');
    }
  }
}

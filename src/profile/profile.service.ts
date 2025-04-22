import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import { Model } from 'mongoose';
import { EditProfileDto } from './dto/edit-profile-dto';
import sharp from 'sharp';
import { join } from 'path';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { Book } from 'src/book/schemas/book.schema';
import { AddBookDto } from './dto/add-book.dto';
import { ReadCategory } from 'src/types';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
    @InjectModel('Book') private readonly bookModel: Model<Book>,
  ) {}

  async editProfile(id: string, editProfileDto: EditProfileDto, avatar?: Express.Multer.File) {
    if (avatar) {
      editProfileDto.avatar = await this.compressAndSaveAvatar(avatar);
    }

    return await this.profileModel.findOneAndUpdate({ user: id }, editProfileDto);
  }

  async getProfile(id: string): Promise<Profile> {
    return this.findProfileByUser(id);
  }

  async addReadBook(addBookDto: AddBookDto) {
    const { book, userId, readCategory } = addBookDto;

    const bookExists = await this.bookModel.exists({ _id: book.googleId });

    if (!bookExists) {
      await this.bookModel.create({ ...book, _id: book.googleId });
    }

    return await this.profileModel.findOneAndUpdate(
      { user: userId },
      { $push: { [readCategory]: book.googleId } },
      { new: true },
    );
  }

  async getReadBooks(userId: string, readCategory: ReadCategory): Promise<String[]> {
    const books = await this.profileModel.findOne({ user: userId }).select(readCategory).populate(readCategory);

    return books ? books[readCategory] : [];
  }

  async addFollower() {}

  private async findProfileByUser(id: string): Promise<Profile> {
    try {
      return await this.profileModel.findOne({ user: id }).exec();
    } catch (err) {
      throw new NotFoundException('Profile not found.');
    }
  }

  private async compressAndSaveAvatar(avatar: Express.Multer.File) {
    const uniqueFileName = `${randomUUID()}.webp`;
    const outputDir = join(process.cwd(), 'avatars');
    const outputPath = join(outputDir, uniqueFileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await sharp(avatar.buffer).webp({ quality: 30 }).toFile(outputPath);

    return uniqueFileName;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import { Model, Types } from 'mongoose';
import { EditProfileDto } from './dto/edit-profile-dto';
import sharp from 'sharp';
import { InjectS3, S3 } from 'nestjs-s3';
import { randomUUID } from 'crypto';
import { AddBookDto } from './dto/add-book.dto';
import { ReadCategory } from 'src/types';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
    @InjectS3() private readonly s3: S3,
  ) {}

  async editProfile(id: string, editProfileDto: EditProfileDto, avatar?: Express.Multer.File) {
    if (avatar) {
      editProfileDto.avatar = await this.compressAndUploadAvatar(avatar, id);
    }

    return await this.profileModel.findOneAndUpdate({ user: id }, editProfileDto);
  }

  async getProfile(id: string): Promise<Profile> {
    return this.findProfileByUser(id);
  }

  async addReadBook(addBookDto: AddBookDto) {
    const { bookId, userId, readCategory, oldCategory } = addBookDto;

    await this.checkOldCategory(oldCategory, userId, bookId);

    if (readCategory) {
      return await this.profileModel.findOneAndUpdate(
        { user: userId },
        { $push: { [readCategory]: bookId } },
        { new: true },
      );
    }

    return await this.profileModel.findOne({ user: userId });
  }

  async getReadBooks(userId: string, readCategory: ReadCategory): Promise<Object[]> {
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

  private async compressAndUploadAvatar(avatar: Express.Multer.File, userId: string) {
    const uniqueFileName = `${randomUUID()}`;
    const buffer = await sharp(avatar.buffer).webp({ quality: 30 }).toBuffer();

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: avatar.mimetype,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));

      const profile = await this.profileModel.findOne({ user: userId }).select('avatar');

      if (profile.avatar) {
        await this.s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: profile.avatar,
          }),
        );
      }
    } catch (err) {
      console.log(err);
    }

    return params.Key;
  }

  // private async checkBookExists(book: Book, bookId: string) {
  //   const bookExists = await this.bookModel.exists({ _id: bookId });

  //   if (!bookExists) {
  //     await this.bookModel.create({ ...book, _id: book.googleId });
  //   }
  // }

  private async checkOldCategory(oldCategory: string, userId: string, bookId: string) {
    if (oldCategory) {
      await this.profileModel.findOneAndUpdate({ user: userId }, { $pull: { [oldCategory]: bookId } });
    }
  }
}

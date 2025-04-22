import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { EditProfileDto } from './dto/edit-profile-dto';
import { CheckAccessGuard } from 'src/auth/guards/checkAccess.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddBookDto } from './dto/add-book.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CheckAccessGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB in bytes
      },
      fileFilter: (_, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
    }),
  )
  async editProfile(@Request() req, @Body() editProfileDto: EditProfileDto, @UploadedFile() file: Express.Multer.File) {
    return await this.profileService.editProfile(req.params.id, editProfileDto, file);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Param() params) {
    return await this.profileService.getProfile(params.id);
  }

  @Post('add-read-book')
  @HttpCode(HttpStatus.OK)
  async addBook(@Body() addBookDto: AddBookDto) {
    return await this.profileService.addReadBook(addBookDto);
  }

  @Get('get-read-books/:userId/:readCategory')
  @HttpCode(HttpStatus.OK)
  async getReadBooks(@Param() params): Promise<String[]> {
    return await this.profileService.getReadBooks(params.userId, params.readCategory);
  }
}

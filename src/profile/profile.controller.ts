import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { EditProfileDto } from './dto/edit-profile-dto';
import { CheckAccessGuard } from 'src/auth/guards/checkAccess.guard';
import { ReadCategory } from 'src/types';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CheckAccessGuard)
  async editProfile(@Request() req, @Body() editProfileDto: EditProfileDto) {
    return await this.profileService.editProfile(req.params.id, editProfileDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Param() params) {
    return await this.profileService.getProfile(params.id);
  }

  @Post('add-read-book')
  @HttpCode(HttpStatus.OK)
  async addBook(@Request() req, @Body() readCategory: ReadCategory, bookId: string, profileId: string) {
    return await this.profileService.addReadBook(readCategory, bookId, profileId);
  }
}

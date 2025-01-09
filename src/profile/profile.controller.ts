import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { EditProfileDto } from './dto/edit-profile-dto';
import { CheckAccessGuard } from 'src/auth/guards/checkAccess.guard';

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
}

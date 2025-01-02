import { Body, Controller, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { EditProfileDto } from './dto/edit-profile-dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async editProfile(@Param() params, @Body() editProfileDto: EditProfileDto) {
    return await this.profileService.editProfile(params.id, editProfileDto);
  }
}

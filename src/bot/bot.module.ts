import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { UserModule } from '../user/user.module';
import { BotUpdate } from './bot.update';

@Module({
  imports: [UserModule],
  providers: [BotService, BotUpdate],
  exports: [BotService],
})
export class BotModule {}

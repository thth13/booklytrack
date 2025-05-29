import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {
  async handleStart(ctx: any) {
    await ctx.reply('Welcome to BooklyTrack bot! 📚');
  }
}

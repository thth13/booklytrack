import { Injectable } from '@nestjs/common';
import { Command, Start } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { UserService } from '../user/user.service';

@Injectable()
export class BotService {
  constructor(private readonly userService: UserService) {}

  @Start()
  async handleStart(ctx: Context) {
    const botId = ctx.from.id.toString();
    const startPayload = (ctx.message as any)?.text?.split(' ')[1];
    const existingUser = await this.userService.findByBotId(botId);

    if (startPayload && !existingUser) {
      const userId = startPayload;
      await this.userService.updateBotId(userId, botId);
      await ctx.reply('Account successfully linked! 🎉');
    }
  }
}

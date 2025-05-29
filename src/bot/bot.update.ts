import { Start, Update } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { Context } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async startCommand(ctx: Context) {
    await this.botService.handleStart(ctx);
  }
}

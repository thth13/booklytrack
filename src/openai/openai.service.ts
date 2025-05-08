import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
// Import the specific type for message parameters
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

@Injectable()
export class OpenAiService {
  private readonly openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-dc9743d618234776bb66ac0cddd8b063',
  });

  async generateQuestions(notes: string[]): Promise<string[]> {
    const prompt = `
      На основе следующих заметок пользователя о прочитанной книге сгенерируй 5 тестовых вопросов для проверки понимания материала.
      Вопросы должны быть разного типа: на знание фактов, на понимание концепций, на анализ.
      Отвечай только списком вопросов, без дополнительных пояснений.
      
      Заметки пользователя:
      ${notes.join('\n')}
    `;

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'deepseek-chat',
    });

    const questions = completion.choices[0].message.content.split('\n').filter((q) => q.trim().length > 0);

    return questions;
  }

  async evaluateAnswer(
    question: string,
    userAnswer: string,
    notes: string[],
  ): Promise<{ score: number; feedback: string }> {
    const prompt = `
      Оцени ответ пользователя на вопрос по книге. Учитывай заметки пользователя о книге.
      Верни JSON объект с полями score (от 0 до 10) и feedback (краткий фидбек).
      
      Вопрос: ${question}
      Ответ пользователя: ${userAnswer}
      Заметки пользователя о книге: ${notes.join('\n')}
      
      Ответ должен быть только в формате JSON, без дополнительного текста.
    `;

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'deepseek-chat',
      response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0].message.content);
  }
}

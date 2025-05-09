import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAiService {
  private readonly openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.OPENAI_API_KEY,
  });

  async generateQuestions(notes: string[]): Promise<string[]> {
    const prompt = `
      Based on the following user notes about a book they read, generate 5 test questions to check their understanding of the material.
      The questions should be of different types: factual recall, conceptual understanding, and analysis.
      Respond only with a list of questions, without any additional explanations.
      Respond in the same language as the user's notes.
      
      User notes:
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
      Evaluate the user's answer to the question about the book. Consider the user's notes on the book.
      Return a JSON object with the fields "score" (from 0 to 10) and "feedback" (brief feedback).
      Respond in the same language as the user's answer and notes.
      
      Question: ${question}
      User's answer: ${userAnswer}
      User's notes on the book: ${notes.join('\n')}
      
      The response must be in JSON format only, with no additional text.
    `;

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'deepseek-chat',
      response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0].message.content);
  }
}

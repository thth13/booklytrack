import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QuizResult } from './schemas/quiz-result.schema';
import { QuizAnswer } from './schemas/quiz-answer.schema';
import { OpenAiService } from '../openai/openai.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QuizGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeQuizzes = new Map<
    string,
    {
      userId: string;
      notes: string[];
      questions: string[];
      currentQuestionIndex: number;
      socket: Socket;
      resultId?: any;
    }
  >();

  constructor(
    @InjectModel(QuizResult.name) private quizResultModel: Model<QuizResult>,
    @InjectModel(QuizAnswer.name) private quizAnswerModel: Model<QuizAnswer>,
    private readonly openaiService: OpenAiService,
  ) {}

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.activeQuizzes.delete(socket.id);
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('start_quiz')
  async handleStartQuiz(@ConnectedSocket() socket: Socket, @MessageBody() data: { userId: string; notes: string[] }) {
    try {
      const questions = await this.openaiService.generateQuestions(data.notes);

      const result = await this.quizResultModel.create({
        userId: data.userId,
        notes: data.notes.join('|'),
        totalScore: 0,
      });

      this.activeQuizzes.set(socket.id, {
        userId: data.userId,
        notes: data.notes,
        questions,
        currentQuestionIndex: 0,
        socket,
        resultId: result._id,
      });

      // Отправляем первый вопрос
      socket.emit('question', {
        question: questions[0],
        questionNumber: 1,
        totalQuestions: questions.length,
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to start quiz' });
      console.error('Quiz start error:', error);
    }
  }

  @SubscribeMessage('submit_answer')
  async handleSubmitAnswer(@ConnectedSocket() socket: Socket, @MessageBody() data: { answer: string }) {
    const quiz = this.activeQuizzes.get(socket.id);

    if (!quiz) {
      socket.emit('error', { message: 'No active quiz found' });
      return;
    }

    try {
      // Оцениваем ответ
      const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
      const evaluation = await this.openaiService.evaluateAnswer(currentQuestion, data.answer, quiz.notes);

      // Сохраняем ответ в MongoDB
      const answer = await this.quizAnswerModel.create({
        question: currentQuestion,
        userAnswer: data.answer,
        score: evaluation.score,
        feedback: evaluation.feedback,
        result: quiz.resultId,
      });

      // Обновляем общий счет
      await this.quizResultModel.findByIdAndUpdate(quiz.resultId, {
        $inc: { totalScore: evaluation.score },
        $push: { answers: answer._id },
      });

      // Переходим к следующему вопросу
      quiz.currentQuestionIndex++;

      // Если вопросы закончились
      if (quiz.currentQuestionIndex >= quiz.questions.length) {
        await this.quizResultModel.findByIdAndUpdate(quiz.resultId, {
          completedAt: new Date(),
        });

        const result = await this.quizResultModel.findById(quiz.resultId);
        socket.emit('quiz_completed', {
          totalScore: result.totalScore,
          maxPossibleScore: quiz.questions.length * 10,
        });
        this.activeQuizzes.delete(socket.id);
        return;
      }

      // Отправляем следующий вопрос
      socket.emit('question', {
        question: quiz.questions[quiz.currentQuestionIndex],
        questionNumber: quiz.currentQuestionIndex + 1,
        totalQuestions: quiz.questions.length,
        previousAnswerFeedback: evaluation.feedback,
        previousAnswerScore: evaluation.score,
      });
    } catch (error) {
      socket.emit('error', { message: 'Error processing your answer' });
      console.error('Answer submission error:', error);
    }
  }

  @SubscribeMessage('get_history')
  async handleGetHistory(@ConnectedSocket() socket: Socket, @MessageBody() data: { userId: string }) {
    try {
      const results = await this.quizResultModel
        .find({
          userId: data.userId,
        })
        .populate('answers')
        .sort({ createdAt: -1 })
        .exec();

      socket.emit('history_data', {
        results: results.map((r) => ({
          id: r._id,
          totalScore: r.totalScore,
          completedAt: r.completedAt,
          answers: r.answers,
        })),
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to get history' });
    }
  }
}

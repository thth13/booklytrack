import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { QuizAnswer } from './quiz-answer.schema';

@Schema({ timestamps: true })
export class QuizResult extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop()
  notes: string;

  @Prop({ default: 0 })
  totalScore: number;

  @Prop()
  completedAt: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'QuizAnswer' }] })
  answers: QuizAnswer[];
}

export const QuizResultSchema = SchemaFactory.createForClass(QuizResult);

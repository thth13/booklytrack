import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class QuizAnswer extends Document {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  userAnswer: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  feedback: string;

  @Prop({ type: 'ObjectId', ref: 'QuizResult' })
  result: string;
}

export const QuizAnswerSchema = SchemaFactory.createForClass(QuizAnswer);

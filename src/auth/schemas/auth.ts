import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CatDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // @Prop({
  //   type: Types.ObjectId,
  //   ref: User.name
  // })
  // user: User
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

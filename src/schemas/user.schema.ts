import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export enum UserRole {
  MEMBER = 'member',
  ORGANIZER = 'organizer',
}
@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.MEMBER, 
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

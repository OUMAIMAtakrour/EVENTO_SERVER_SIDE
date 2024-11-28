import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';

export type EventDocument = Events & Document;
@Schema()
export class Events {
  @Prop({ types: [{ type: Types.ObjectId, ref: 'Users' }] })
  Owner: Types.ObjectId;
  @Prop({ required: true })
  title: string;
  @Prop({})
  description: string;
  @Prop({ types: [{ type: Types.ObjectId, ref: 'Users' }] })
  members: User[];
}

export const EventsSchema = SchemaFactory.createForClass(Events);

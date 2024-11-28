import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { EventDocument, Events, EventsSchema } from 'src/schemas/events.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UserModule } from 'src/core/user/user.module';
import { UserService } from 'src/core/user/user.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Events.name) private readonly eventModel: Model<EventDocument>,
    // @InjectModel(User.name) private readonly userModel: Model<UserModule>,
    // private readonly userService: UserService,
  ) {}
  public async createNewEvent(
    dto: CreateEventDto,
    userId: string,
  ): Promise<EventDocument> {
    const newEvent = new this.eventModel({
      ...dto,
      title: dto.title.toLowerCase(),
      Owner: new Types.ObjectId(userId),
    });

    return newEvent.save();
  }

  public async findAll(): Promise<EventDocument[]> {
    return this.eventModel.find().exec();
  }

  public async findOne(id: string): Promise<EventDocument> {
    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<EventDocument> {
    const event = await this.eventModel
      .findOneAndUpdate(
        { _id: id, Owner: new Types.ObjectId(userId) },
        {
          ...updateEventDto,
          title: updateEventDto.title?.toLowerCase(),
        },
        { new: true },
      )
      .exec();

    if (!event) {
      throw new NotFoundException(
        `Event with ID ${id} not found or you are not the owner`,
      );
    }

    return event;
  }

  public async remove(id: string, userId: string): Promise<EventDocument> {
    const deletedEvent = await this.eventModel
      .findOneAndDelete({
        _id: id,
        Owner: new Types.ObjectId(userId),
      })
      .exec();

    if (!deletedEvent) {
      throw new NotFoundException(
        `Event with ID ${id} not found or you are not the owner`,
      );
    }

    return deletedEvent;
  }
}

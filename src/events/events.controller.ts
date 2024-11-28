import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/schemas/user.schema';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @Roles(UserRole.ORGANIZER)
  async create(@Body() createEventDto: CreateEventDto, @CurrentUser() user) {
    return this.eventsService.createNewEvent(createEventDto, user.userId);
  }
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  @Roles(UserRole.ORGANIZER)
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user,
  ) {
    return this.eventsService.update(id, updateEventDto, user.userId);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  @Roles(UserRole.ORGANIZER)
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.eventsService.remove(id, user.userId);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Events } from '../schemas/events.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { Model } from 'mongoose';

describe('EventsService', () => {
  let service: EventsService;
  let mockEventModel: {
    save: jest.Mock;
    new: jest.Mock;
  };

  const mockUser = {
    userId: '60d5ecb8b3b3a3001f3e2d2a', 
    role: 'user',
  };

  const createEventDto: CreateEventDto = {
    title: 'Test Event',
    description: 'A test event description',
    members: ['60d5ecb8b3b3a3001f3e2d2b', '60d5ecb8b3b3a3001f3e2d2c'],
  };

  beforeEach(async () => {
    mockEventModel = {
      save: jest.fn(),
      new: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Events.name),
          useValue: {
            new: mockEventModel.new,
            save: mockEventModel.save,
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  describe('createNewEvent', () => {
    it('should create a new event successfully', async () => {
     
      const mockSavedEvent = {
        ...createEventDto,
        _id: '60d5ecb8b3b3a3001f3e2d2d',
        Owner: mockUser.userId,
        title: createEventDto.title.toLowerCase(),
      };

      mockEventModel.new.mockReturnValue({
        ...mockSavedEvent,
        save: mockEventModel.save,
      });

      mockEventModel.save.mockResolvedValue(mockSavedEvent);

      const result = await service.createNewEvent(
        createEventDto,
        mockUser.userId,
      );

      expect(result).toBeDefined();
      expect(result.title).toBe(createEventDto.title.toLowerCase());
      expect(result.Owner.toString()).toBe(mockUser.userId);
      expect(result.members).toEqual(createEventDto.members);

      expect(mockEventModel.new).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createEventDto,
          title: createEventDto.title.toLowerCase(),
          Owner: expect.anything(),
        }),
      );
      expect(mockEventModel.save).toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const invalidDto = {
        title: '',
        description: 'Test description',
        members: [],
      };

      
      await expect(
        service.createNewEvent(invalidDto as CreateEventDto, mockUser.userId),
      ).rejects.toThrow();
    });

    it('should lowercase the event title', async () => {
      const mixedCaseDto = {
        ...createEventDto,
        title: 'MiXeD CaSe EvEnT',
      };

      const mockSavedEvent = {
        ...mixedCaseDto,
        _id: '60d5ecb8b3b3a3001f3e2d2d',
        Owner: mockUser.userId,
        title: mixedCaseDto.title.toLowerCase(),
      };

      mockEventModel.new.mockReturnValue({
        ...mockSavedEvent,
        save: mockEventModel.save,
      });

      mockEventModel.save.mockResolvedValue(mockSavedEvent);

      const result = await service.createNewEvent(
        mixedCaseDto,
        mockUser.userId,
      );

      expect(result.title).toBe(mixedCaseDto.title.toLowerCase());
    });
  });
});

import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import type { CreateBookingDto } from './dto/booking.dto';
import { CreateBookingDtoSchema } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(Role.PASSENGER)
  create(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(CreateBookingDtoSchema)) createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.create(user.id, createBookingDto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query('tripId') tripId?: string) {
    // Passengers see only their bookings, others can filter
    const userId = user.role === Role.PASSENGER ? user.id : undefined;
    return this.bookingService.findAll(userId, tripId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id/cancel')
  @Roles(Role.PASSENGER)
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingService.cancel(id, user.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}

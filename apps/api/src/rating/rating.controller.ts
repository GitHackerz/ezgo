import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import type { CreateRatingDto } from './dto/rating.dto';
import { CreateRatingDtoSchema } from './dto/rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @Roles(Role.PASSENGER)
  create(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(CreateRatingDtoSchema)) createRatingDto: CreateRatingDto,
  ) {
    return this.ratingService.create(user.id, createRatingDto);
  }

  @Get('trip/:tripId')
  findByTrip(@Param('tripId') tripId: string) {
    return this.ratingService.findByTrip(tripId);
  }

  @Get('driver/:driverId')
  findByDriver(@Param('driverId') driverId: string) {
    return this.ratingService.findByDriver(driverId);
  }
}

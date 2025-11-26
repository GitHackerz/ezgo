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
import { TripService } from './trip.service';
import type { CreateTripDto, UpdateTripDto } from './dto/trip.dto';
import { CreateTripDtoSchema, UpdateTripDtoSchema } from './dto/trip.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  create(@Body(new ZodValidationPipe(CreateTripDtoSchema)) createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @Get()
  findAll(
    @Query('routeId') routeId?: string,
    @Query('driverId') driverId?: string,
    @Query('status') status?: string,
  ) {
    return this.tripService.findAll(routeId, driverId, status);
  }

  @Get('upcoming')
  findUpcoming(@Query('limit') limit?: string) {
    return this.tripService.findUpcoming(limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN, Role.DRIVER)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTripDtoSchema)) updateTripDto: UpdateTripDto,
  ) {
    return this.tripService.update(id, updateTripDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  remove(@Param('id') id: string) {
    return this.tripService.remove(id);
  }
}

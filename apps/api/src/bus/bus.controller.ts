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
import { BusService } from './bus.service';
import type { CreateBusDto, UpdateBusDto, UpdateBusLocationDto } from './dto/bus.dto';
import { CreateBusDtoSchema, UpdateBusDtoSchema, UpdateBusLocationDtoSchema } from './dto/bus.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('buses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Post()
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  create(@Body(new ZodValidationPipe(CreateBusDtoSchema)) createBusDto: CreateBusDto) {
    return this.busService.create(createBusDto);
  }

  @Get()
  findAll(@Query('companyId') companyId?: string, @Query('status') status?: string) {
    return this.busService.findAll(companyId, status);
  }

  @Get('nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('radius') radius?: string,
  ) {
    return this.busService.findNearby(
      parseFloat(lat),
      parseFloat(lon),
      radius ? parseFloat(radius) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.busService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateBusDtoSchema)) updateBusDto: UpdateBusDto,
  ) {
    return this.busService.update(id, updateBusDto);
  }

  @Patch(':id/location')
  @Roles(Role.DRIVER)
  updateLocation(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateBusLocationDtoSchema)) locationDto: UpdateBusLocationDto,
  ) {
    return this.busService.updateLocation(id, locationDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  remove(@Param('id') id: string) {
    return this.busService.remove(id);
  }
}

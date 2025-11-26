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
import { RouteService } from './route.service';
import type { CreateRouteDto, UpdateRouteDto } from './dto/route.dto';
import { CreateRouteDtoSchema, UpdateRouteDtoSchema } from './dto/route.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  create(@Body(new ZodValidationPipe(CreateRouteDtoSchema)) createRouteDto: CreateRouteDto) {
    return this.routeService.create(createRouteDto);
  }

  @Get()
  findAll(@Query('companyId') companyId?: string, @Query('isActive') isActive?: string) {
    return this.routeService.findAll(companyId, isActive === 'true');
  }

  @Get('search')
  search(@Query('origin') origin?: string, @Query('destination') destination?: string) {
    return this.routeService.search(origin, destination);
  }

  @Get('popular')
  getPopular(@Query('limit') limit?: string) {
    return this.routeService.getPopular(limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateRouteDtoSchema)) updateRouteDto: UpdateRouteDto,
  ) {
    return this.routeService.update(id, updateRouteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  remove(@Param('id') id: string) {
    return this.routeService.remove(id);
  }
}

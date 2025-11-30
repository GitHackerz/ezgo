import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { CreateLocationDto } from "./dto/create-location.dto";
import { FilterLocationsDto } from "./dto/filter-locations.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { LocationService } from "./location.service";

@ApiTags("locations")
@Controller("locations")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationController {
	constructor(private readonly locationService: LocationService) {}

	@Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new location (Admin only)' })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

	@Get()
  @ApiOperation({ summary: 'Get all locations with optional filters' })
  @ApiResponse({ status: 200, description: 'List of locations' })
  findAll(@Query() filters: FilterLocationsDto) {
    return this.locationService.findAll(filters);
  }

	@Get('search')
  @ApiOperation({ summary: 'Search locations (autocomplete)' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query('q') query: string) {
    return this.locationService.search(query || '');
  }

	@Get(':id')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiResponse({ status: 200, description: 'Location details' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

	@Patch(":id")
	@UseGuards(RolesGuard)
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Update location (Admin only)" })
	@ApiResponse({ status: 200, description: "Location updated successfully" })
	@ApiResponse({ status: 403, description: "Forbidden - Admin only" })
	@ApiResponse({ status: 404, description: "Location not found" })
	update(
		@Param('id') id: string,
		@Body() updateLocationDto: UpdateLocationDto,
	) {
		return this.locationService.update(id, updateLocationDto);
	}

	@Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete location (Admin only)' })
  @ApiResponse({ status: 200, description: 'Location deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}

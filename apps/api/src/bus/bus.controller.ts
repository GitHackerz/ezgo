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
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { BusService } from "./bus.service";
import {
    CreateBusDto,
    UpdateBusDto,
    UpdateBusLocationDto,
} from "./dto/bus.dto";

@ApiTags("buses")
@Controller("buses")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BusController {
	constructor(private readonly busService: BusService) {}

	@Post()
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  @ApiOperation({ summary: 'Create a new bus', description: 'Add a new bus to the fleet' })
  @ApiResponse({ status: 201, description: 'Bus successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateBusDto })
  create(@Body() createBusDto: CreateBusDto) {
    return this.busService.create(createBusDto);
  }

	@Get()
	@ApiOperation({
		summary: "Get all buses",
		description: "Retrieve all buses with optional filters",
	})
	@ApiResponse({ status: 200, description: "Buses retrieved successfully" })
	@ApiQuery({
		name: "companyId",
		required: false,
		description: "Filter by company ID",
	})
	@ApiQuery({
		name: "status",
		required: false,
		description: "Filter by bus status",
	})
	findAll(
		@Query('companyId') companyId?: string,
		@Query('status') status?: string,
	) {
		return this.busService.findAll(companyId, status);
	}

	@Get("nearby")
	@ApiOperation({
		summary: "Find nearby buses",
		description: "Find buses within a specified radius",
	})
	@ApiResponse({
		status: 200,
		description: "Nearby buses retrieved successfully",
	})
	@ApiQuery({ name: "lat", description: "Latitude coordinate" })
	@ApiQuery({ name: "lon", description: "Longitude coordinate" })
	@ApiQuery({
		name: "radius",
		required: false,
		description: "Search radius in km (default: 5)",
	})
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
  @ApiOperation({ summary: 'Get bus by ID', description: 'Retrieve a specific bus with maintenance history' })
  @ApiResponse({ status: 200, description: 'Bus retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Bus not found' })
  @ApiParam({ name: 'id', description: 'Bus ID' })
  findOne(@Param('id') id: string) {
    return this.busService.findOne(id);
  }

	@Patch(":id")
	@Roles(Role.ADMIN, Role.COMPANY_ADMIN)
	@ApiOperation({
		summary: "Update bus details",
		description: "Update bus information",
	})
	@ApiResponse({ status: 200, description: "Bus successfully updated" })
	@ApiResponse({ status: 404, description: "Bus not found" })
	@ApiParam({ name: "id", description: "Bus ID" })
	@ApiBody({ type: UpdateBusDto })
	update(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto) {
		return this.busService.update(id, updateBusDto);
	}

	@Patch(":id/location")
	@Roles(Role.DRIVER)
	@ApiOperation({
		summary: "Update bus location",
		description: "Update real-time GPS coordinates (driver only)",
	})
	@ApiResponse({ status: 200, description: "Location successfully updated" })
	@ApiResponse({ status: 404, description: "Bus not found" })
	@ApiParam({ name: "id", description: "Bus ID" })
	@ApiBody({ type: UpdateBusLocationDto })
	updateLocation(
		@Param('id') id: string,
		@Body() locationDto: UpdateBusLocationDto,
	) {
		return this.busService.updateLocation(id, locationDto);
	}

	@Delete(':id')
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  @ApiOperation({ summary: 'Delete a bus', description: 'Remove a bus from the fleet' })
  @ApiResponse({ status: 200, description: 'Bus deleted successfully' })
  @ApiResponse({ status: 404, description: 'Bus not found' })
  @ApiParam({ name: 'id', description: 'Bus ID' })
  remove(@Param('id') id: string) {
    return this.busService.remove(id);
  }
}

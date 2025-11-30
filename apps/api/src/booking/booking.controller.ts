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
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/booking.dto";

@ApiTags("bookings")
@Controller("bookings")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Post()
	@Roles(Role.PASSENGER)
	@ApiOperation({
		summary: "Create a new booking",
		description: "Book a seat on a trip",
	})
	@ApiResponse({ status: 201, description: "Booking successfully created" })
	@ApiResponse({ status: 400, description: "Invalid input data" })
	@ApiResponse({ status: 404, description: "Trip not found" })
	@ApiBody({ type: CreateBookingDto })
	create(@CurrentUser() user: any, @Body() createBookingDto: CreateBookingDto) {
		return this.bookingService.create(user.id, createBookingDto);
	}

	@Get()
	@ApiOperation({
		summary: "Get all bookings",
		description: "Retrieve bookings (filtered by user role)",
	})
	@ApiResponse({ status: 200, description: "Bookings retrieved successfully" })
	@ApiQuery({
		name: "tripId",
		required: false,
		description: "Filter by trip ID",
	})
	findAll(@CurrentUser() user: any, @Query('tripId') tripId?: string) {
		const userId = user.role === Role.PASSENGER ? user.id : undefined;
		return this.bookingService.findAll(userId, tripId);
	}

	@Get(':id')
  @ApiOperation({ summary: 'Get booking by ID', description: 'Retrieve a specific booking' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

	@Patch(":id/cancel")
	@Roles(Role.PASSENGER)
	@ApiOperation({
		summary: "Cancel a booking",
		description: "Cancel an existing booking",
	})
	@ApiResponse({ status: 200, description: "Booking cancelled successfully" })
	@ApiResponse({ status: 404, description: "Booking not found" })
	@ApiParam({ name: "id", description: "Booking ID" })
	cancel(@Param('id') id: string, @CurrentUser() user: any) {
		return this.bookingService.cancel(id, user.id);
	}

	@Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a booking', description: 'Permanently delete a booking (admin only)' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}

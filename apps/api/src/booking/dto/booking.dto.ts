import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BookingStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBookingDto {
	@ApiProperty({
		example: "123e4567-e89b-12d3-a456-426614174000",
		description: "Trip ID",
	})
	@IsUUID()
	tripId: string;

	@ApiPropertyOptional({ example: "A12", description: "Seat number" })
	@IsString()
	@IsOptional()
	seatNumber?: string;
}

export class UpdateBookingDto {
	@ApiProperty({ enum: BookingStatus, description: "Booking status" })
	@IsEnum(BookingStatus)
	status: BookingStatus;
}

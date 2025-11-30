import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BusStatus } from "@prisma/client";
import { Type } from "class-transformer";
import {
	IsEnum,
	IsInt,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	IsUUID,
	Max,
	Min,
	MinLength,
} from "class-validator";

export class CreateBusDto {
	@ApiProperty({ example: "ABC-1234", description: "Bus plate number" })
	@IsString()
	@MinLength(3)
	plateNumber: string;

	@ApiProperty({ example: 50, description: "Bus seating capacity" })
	@IsInt()
	@IsPositive()
	@Type(() => Number)
	capacity: number;

	@ApiPropertyOptional({
		example: "Mercedes-Benz Sprinter",
		description: "Bus model",
	})
	@IsString()
	@IsOptional()
	model?: string;

	@ApiPropertyOptional({ example: 2023, description: "Bus manufacturing year" })
	@IsInt()
	@Min(1900)
	@Max(new Date().getFullYear() + 1)
	@Type(() => Number)
	@IsOptional()
	year?: number;

	@ApiProperty({
		example: "123e4567-e89b-12d3-a456-426614174000",
		description: "Company ID",
	})
	@IsUUID()
	companyId: string;
}

export class UpdateBusDto {
	@ApiPropertyOptional({ example: "ABC-1234", description: "Bus plate number" })
	@IsString()
	@MinLength(3)
	@IsOptional()
	plateNumber?: string;

	@ApiPropertyOptional({ example: 50, description: "Bus seating capacity" })
	@IsInt()
	@IsPositive()
	@Type(() => Number)
	@IsOptional()
	capacity?: number;

	@ApiPropertyOptional({
		example: "Mercedes-Benz Sprinter",
		description: "Bus model",
	})
	@IsString()
	@IsOptional()
	model?: string;

	@ApiPropertyOptional({ example: 2023, description: "Bus manufacturing year" })
	@IsInt()
	@Min(1900)
	@Max(new Date().getFullYear() + 1)
	@Type(() => Number)
	@IsOptional()
	year?: number;

	@ApiPropertyOptional({ enum: BusStatus, description: "Bus status" })
	@IsEnum(BusStatus)
	@IsOptional()
	status?: BusStatus;
}

export class UpdateBusLocationDto {
	@ApiProperty({
		example: 40.7128,
		description: "Latitude coordinate",
		minimum: -90,
		maximum: 90,
	})
	@IsNumber()
	@Min(-90)
	@Max(90)
	@Type(() => Number)
	latitude: number;

	@ApiProperty({
		example: -74.006,
		description: "Longitude coordinate",
		minimum: -180,
		maximum: 180,
	})
	@IsNumber()
	@Min(-180)
	@Max(180)
	@Type(() => Number)
	longitude: number;
}

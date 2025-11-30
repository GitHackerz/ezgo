import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export enum LocationType {
	CITY = "CITY",
	STATION = "STATION",
	LANDMARK = "LANDMARK",
}

export class CreateLocationDto {
	@ApiProperty({ example: "Tunis Centre Ville" })
	@IsString()
	name: string;

	@ApiProperty({ example: "Tunis" })
	@IsString()
	city: string;

	@ApiProperty({ example: "Tunis" })
	@IsString()
	governorate: string;

	@ApiPropertyOptional({ example: "Avenue Habib Bourguiba, Tunis" })
	@IsOptional()
	@IsString()
	address?: string;

	@ApiProperty({ example: 36.8065 })
	@IsNumber()
	latitude: number;

	@ApiProperty({ example: 10.1815 })
	@IsNumber()
	longitude: number;

	@ApiPropertyOptional({ enum: LocationType, example: LocationType.CITY })
	@IsOptional()
	@IsEnum(LocationType)
	type?: string;

	@ApiPropertyOptional({ example: true })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;
}

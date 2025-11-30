import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class FilterLocationsDto {
	@ApiPropertyOptional({ example: "Tunis" })
	@IsOptional()
	@IsString()
	city?: string;

	@ApiPropertyOptional({ example: "Tunis" })
	@IsOptional()
	@IsString()
	governorate?: string;

	@ApiPropertyOptional({ example: "CITY" })
	@IsOptional()
	@IsString()
	type?: string;

	@ApiPropertyOptional({ example: true })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;
}

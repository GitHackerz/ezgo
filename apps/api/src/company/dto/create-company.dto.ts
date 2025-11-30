import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateCompanyDto {
	@ApiProperty({ example: "EzGo Transport", description: "Company name" })
	@IsString()
	@MinLength(2)
	name: string;

	@ApiPropertyOptional({
		example: "123 Main St, City, Country",
		description: "Company address",
	})
	@IsString()
	@IsOptional()
	address?: string;

	@ApiPropertyOptional({
		example: "+1234567890",
		description: "Company contact number",
	})
	@IsString()
	@IsOptional()
	contact?: string;
}

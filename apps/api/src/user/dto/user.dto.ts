import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	IsUrl,
	IsUUID,
	MinLength,
} from "class-validator";

export class CreateUserDto {
	@ApiProperty({
		example: "user@example.com",
		description: "User email address",
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		example: "Password123!",
		description: "User password",
		minLength: 8,
	})
	@IsString()
	@MinLength(8)
	password: string;

	@ApiProperty({ example: "John", description: "User first name" })
	@IsString()
	@MinLength(2)
	firstName: string;

	@ApiProperty({ example: "Doe", description: "User last name" })
	@IsString()
	@MinLength(2)
	lastName: string;

	@ApiPropertyOptional({
		example: "+1234567890",
		description: "User phone number",
	})
	@IsString()
	@IsOptional()
	phone?: string;

	@ApiProperty({ enum: Role, description: "User role" })
	@IsEnum(Role)
	role: Role;

	@ApiPropertyOptional({
		example: "123e4567-e89b-12d3-a456-426614174000",
		description: "Company ID for company users",
	})
	@IsUUID()
	@IsOptional()
	companyId?: string;
}

export class UpdateUserDto {
	@ApiPropertyOptional({ example: "John", description: "User first name" })
	@IsString()
	@MinLength(2)
	@IsOptional()
	firstName?: string;

	@ApiPropertyOptional({ example: "Doe", description: "User last name" })
	@IsString()
	@MinLength(2)
	@IsOptional()
	lastName?: string;

	@ApiPropertyOptional({
		example: "+1234567890",
		description: "User phone number",
	})
	@IsString()
	@IsOptional()
	phone?: string;

	@ApiPropertyOptional({
		example: "https://example.com/avatar.jpg",
		description: "User avatar URL",
	})
	@IsUrl()
	@IsOptional()
	avatar?: string;
}

export class UpdatePasswordDto {
	@ApiProperty({
		example: "CurrentPassword123!",
		description: "Current password",
	})
	@IsString()
	currentPassword: string;

	@ApiProperty({
		example: "NewPassword123!",
		description: "New password",
		minLength: 8,
	})
	@IsString()
	@MinLength(8)
	newPassword: string;
}

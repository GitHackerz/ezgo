import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
	MinLength,
} from "class-validator";

export class RegisterDto {
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

	@ApiPropertyOptional({
		enum: Role,
		description: "User role",
		default: Role.PASSENGER,
	})
	@IsEnum(Role)
	@IsOptional()
	role?: Role;

	@ApiPropertyOptional({
		example: "123e4567-e89b-12d3-a456-426614174000",
		description: "Company ID for company users",
	})
	@IsUUID()
	@IsOptional()
	companyId?: string;
}

export class LoginDto {
	@ApiProperty({
		example: "user@example.com",
		description: "User email address",
	})
	@IsEmail()
	email: string;

	@ApiProperty({ example: "Password123!", description: "User password" })
	@IsString()
	password: string;
}

export class ForgotPasswordDto {
	@ApiProperty({
		example: "user@example.com",
		description: "User email address",
	})
	@IsEmail()
	email: string;
}

export class ResetPasswordDto {
	@ApiProperty({
		example: "reset-token-here",
		description: "Password reset token",
	})
	@IsString()
	token: string;

	@ApiProperty({
		example: "NewPassword123!",
		description: "New password",
		minLength: 8,
	})
	@IsString()
	@MinLength(8)
	password: string;
}

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
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from "./dto/user.dto";
import { UserService } from "./user.service";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  @ApiOperation({ summary: 'Create a new user', description: 'Create a new user account (admin only)' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

	@Get()
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve all users with optional company filter' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiQuery({ name: 'companyId', required: false, description: 'Filter by company ID' })
  findAll(@Query('companyId') companyId?: string) {
    return this.userService.findAll(companyId);
  }

	@Get('profile')
  @ApiOperation({ summary: 'Get current user profile', description: 'Retrieve the authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  getProfile(@CurrentUser() user: any) {
    return this.userService.getProfile(user.id);
  }

	@Get(':id')
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieve a specific user' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

	@Patch("profile")
	@ApiOperation({
		summary: "Update own profile",
		description: "Update the authenticated user profile",
	})
	@ApiResponse({ status: 200, description: "Profile updated successfully" })
	@ApiBody({ type: UpdateUserDto })
	updateProfile(
		@CurrentUser() user: any,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.userService.update(user.id, updateUserDto);
	}

	@Patch("password")
	@ApiOperation({
		summary: "Update password",
		description: "Change the authenticated user password",
	})
	@ApiResponse({ status: 200, description: "Password updated successfully" })
	@ApiResponse({ status: 401, description: "Current password is incorrect" })
	@ApiBody({ type: UpdatePasswordDto })
	updatePassword(@CurrentUser() user: any, @Body() dto: UpdatePasswordDto) {
		return this.userService.updatePassword(user.id, dto);
	}

	@Patch(":id")
	@Roles(Role.ADMIN, Role.COMPANY_ADMIN)
	@ApiOperation({
		summary: "Update user",
		description: "Update any user (admin only)",
	})
	@ApiResponse({ status: 200, description: "User updated successfully" })
	@ApiResponse({ status: 404, description: "User not found" })
	@ApiParam({ name: "id", description: "User ID" })
	@ApiBody({ type: UpdateUserDto })
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user', description: 'Remove a user from the system (admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

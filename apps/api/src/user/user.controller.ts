import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto/user.dto';
import { CreateUserDtoSchema, UpdateUserDtoSchema, UpdatePasswordDtoSchema } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  create(@Body(new ZodValidationPipe(CreateUserDtoSchema)) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  findAll(@Query('companyId') companyId?: string) {
    return this.userService.findAll(companyId);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.userService.getProfile(user.id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(UpdateUserDtoSchema)) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Patch('password')
  updatePassword(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(UpdatePasswordDtoSchema)) dto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(user.id, dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUserDtoSchema)) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

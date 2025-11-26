import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { CreatePaymentDto, CreatePaymentIntentDto } from './dto/payment.dto';
import { CreatePaymentDtoSchema, CreatePaymentIntentDtoSchema } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  @Roles(Role.PASSENGER)
  createIntent(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(CreatePaymentIntentDtoSchema)) dto: CreatePaymentIntentDto,
  ) {
    return this.paymentService.createPaymentIntent(user.id, dto);
  }

  @Post()
  @Roles(Role.PASSENGER)
  create(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(CreatePaymentDtoSchema)) createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.create(user.id, createPaymentDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    const userId = user.role === Role.PASSENGER ? user.id : undefined;
    return this.paymentService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Post(':id/refund')
  @Roles(Role.ADMIN, Role.COMPANY_ADMIN)
  refund(@Param('id') id: string) {
    return this.paymentService.refund(id);
  }
}

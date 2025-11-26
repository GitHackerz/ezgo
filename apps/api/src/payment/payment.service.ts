import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, CreatePaymentIntentDto } from './dto/payment.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async createPaymentIntent(userId: string, dto: CreatePaymentIntentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        trip: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    // Create Stripe payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(booking.trip.price * 100), // Convert to cents
      currency: 'tnd',
      metadata: {
        bookingId: booking.id,
        userId: userId,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount: booking.trip.price,
    };
  }

  async create(userId: string, createPaymentDto: CreatePaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: createPaymentDto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    const payment = await this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        userId,
        status: 'COMPLETED',
        currency: 'TND',
      },
      include: {
        booking: {
          include: {
            trip: {
              include: {
                route: true,
              },
            },
          },
        },
      },
    });

    // Update booking status
    await this.prisma.booking.update({
      where: { id: createPaymentDto.bookingId },
      data: {
        status: 'CONFIRMED',
      },
    });

    return payment;
  }

  async findAll(userId?: string) {
    return this.prisma.payment.findMany({
      where: userId ? { userId } : undefined,
      include: {
        booking: {
          include: {
            trip: {
              include: {
                route: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            trip: {
              include: {
                route: true,
                bus: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async refund(id: string) {
    const payment = await this.findOne(id);

    if (payment.status === 'REFUNDED') {
      throw new BadRequestException('Payment already refunded');
    }

    // Update payment status
    const refunded = await this.prisma.payment.update({
      where: { id },
      data: {
        status: 'REFUNDED',
      },
    });

    // Cancel booking
    await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: 'CANCELLED',
      },
    });

    return refunded;
  }
}

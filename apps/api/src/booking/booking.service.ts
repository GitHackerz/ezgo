import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';
import * as crypto from 'crypto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    // Check if trip exists and has available seats
    const trip = await this.prisma.trip.findUnique({
      where: { id: createBookingDto.tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.availableSeats <= 0) {
      throw new BadRequestException('No available seats');
    }

    // Generate QR code (simple hash for now)
    const qrCode = crypto.randomBytes(16).toString('hex');

    // Create booking and update available seats
    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        userId,
        qrCode,
        status: 'PENDING',
      },
      include: {
        trip: {
          include: {
            route: true,
            bus: true,
            driver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
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

    // Decrease available seats
    await this.prisma.trip.update({
      where: { id: createBookingDto.tripId },
      data: {
        availableSeats: {
          decrement: 1,
        },
      },
    });

    return booking;
  }

  async findAll(userId?: string, tripId?: string) {
    return this.prisma.booking.findMany({
      where: {
        ...(userId && { userId }),
        ...(tripId && { tripId }),
      },
      include: {
        trip: {
          include: {
            route: true,
            bus: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        trip: {
          include: {
            route: true,
            bus: true,
            driver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
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
            phone: true,
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async cancel(id: string, userId: string) {
    const booking = await this.findOne(id);

    if (booking.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking already cancelled');
    }

    // Update booking status
    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
      include: {
        trip: true,
      },
    });

    // Increase available seats
    await this.prisma.trip.update({
      where: { id: booking.tripId },
      data: {
        availableSeats: {
          increment: 1,
        },
      },
    });

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.booking.delete({
      where: { id },
    });

    return { message: 'Booking deleted successfully' };
  }
}

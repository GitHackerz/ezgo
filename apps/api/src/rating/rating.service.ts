import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/rating.dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createRatingDto: CreateRatingDto) {
    // Check if trip exists
    const trip = await this.prisma.trip.findUnique({
      where: { id: createRatingDto.tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Check if user has a booking for this trip
    const booking = await this.prisma.booking.findFirst({
      where: {
        tripId: createRatingDto.tripId,
        userId: userId,
        status: 'COMPLETED',
      },
    });

    if (!booking) {
      throw new BadRequestException('You must complete a trip before rating it');
    }

    // Check if already rated
    const existing = await this.prisma.rating.findUnique({
      where: {
        tripId_userId: {
          tripId: createRatingDto.tripId,
          userId: userId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('You have already rated this trip');
    }

    return this.prisma.rating.create({
      data: {
        ...createRatingDto,
        userId,
      },
      include: {
        trip: {
          include: {
            route: true,
            driver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findByTrip(tripId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { tripId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    return {
      ratings,
      average: avgRating,
      count: ratings.length,
    };
  }

  async findByDriver(driverId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: {
        trip: {
          driverId,
        },
      },
      include: {
        trip: {
          include: {
            route: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    return {
      ratings,
      average: avgRating,
      count: ratings.length,
    };
  }
}

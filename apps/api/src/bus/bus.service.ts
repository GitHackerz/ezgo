import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusDto, UpdateBusDto, UpdateBusLocationDto } from './dto/bus.dto';

@Injectable()
export class BusService {
  constructor(private prisma: PrismaService) {}

  async create(createBusDto: CreateBusDto) {
    return this.prisma.bus.create({
      data: createBusDto,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(companyId?: string, status?: string) {
    return this.prisma.bus.findMany({
      where: {
        ...(companyId && { companyId }),
        ...(status && { status: status as any }),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const bus = await this.prisma.bus.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        maintenance: {
          orderBy: {
            scheduledDate: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!bus) {
      throw new NotFoundException('Bus not found');
    }

    return bus;
  }

  async update(id: string, updateBusDto: UpdateBusDto) {
    await this.findOne(id);

    return this.prisma.bus.update({
      where: { id },
      data: updateBusDto,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateLocation(id: string, locationDto: UpdateBusLocationDto) {
    await this.findOne(id);

    return this.prisma.bus.update({
      where: { id },
      data: {
        latitude: locationDto.latitude,
        longitude: locationDto.longitude,
        lastUpdated: new Date(),
      },
    });
  }

  async findNearby(latitude: number, longitude: number, radiusKm: number = 5) {
    // Simple bounding box calculation (for production, use PostGIS or similar)
    const latDelta = radiusKm / 111; // 1 degree latitude ≈ 111 km
    const lonDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

    return this.prisma.bus.findMany({
      where: {
        status: 'ACTIVE',
        latitude: {
          gte: latitude - latDelta,
          lte: latitude + latDelta,
        },
        longitude: {
          gte: longitude - lonDelta,
          lte: longitude + lonDelta,
        },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.bus.delete({
      where: { id },
    });

    return { message: 'Bus deleted successfully' };
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { BusStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import type {
	CreateBusDto,
	UpdateBusDto,
	UpdateBusLocationDto,
} from "./dto/bus.dto";

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
				...(status && { status: status as BusStatus }),
			},
			include: {
				company: {
					select: {
						id: true,
						name: true,
					},
				},
				_count: {
					select: {
						trips: true,
					},
				},
			},
			orderBy: {
				plateNumber: "asc",
			},
		});
	}

	async findNearby(lat: number, lon: number, radius: number = 5) {
		// Find buses with location data within the radius (in km)
		// Using a simple bounding box approach for filtering
		const kmToDegree = 1 / 111; // Approximate conversion
		const latDelta = radius * kmToDegree;
		const lonDelta = radius * kmToDegree;

		const buses = await this.prisma.bus.findMany({
			where: {
				status: BusStatus.ACTIVE,
				latitude: {
					gte: lat - latDelta,
					lte: lat + latDelta,
				},
				longitude: {
					gte: lon - lonDelta,
					lte: lon + lonDelta,
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

		// Calculate actual distance and filter
		return buses
			.map((bus) => ({
				...bus,
				distance: this.calculateDistance(
					lat,
					lon,
					bus.latitude ?? 0,
					bus.longitude ?? 0,
				),
			}))
			.filter((bus) => bus.distance <= radius)
			.sort((a, b) => a.distance - b.distance);
	}

	private calculateDistance(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number,
	): number {
		const R = 6371; // Earth's radius in km
		const dLat = this.toRad(lat2 - lat1);
		const dLon = this.toRad(lon2 - lon1);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRad(lat1)) *
				Math.cos(this.toRad(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	private toRad(deg: number): number {
		return deg * (Math.PI / 180);
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
				trips: {
					where: {
						departureTime: {
							gte: new Date(),
						},
					},
					orderBy: {
						departureTime: "asc",
					},
					take: 10,
				},
				maintenance: {
					orderBy: {
						scheduledDate: "desc",
					},
					take: 5,
				},
			},
		});

		if (!bus) {
			throw new NotFoundException("Bus not found");
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

	async remove(id: string) {
		await this.findOne(id);

		await this.prisma.bus.delete({
			where: { id },
		});

		return { message: "Bus deleted successfully" };
	}
}

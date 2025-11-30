import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateTripDto, UpdateTripDto } from "./dto/trip.dto";

@Injectable()
export class TripService {
	constructor(private prisma: PrismaService) {}

	async create(createTripDto: CreateTripDto) {
		return this.prisma.trip.create({
			data: {
				...createTripDto,
				departureTime: new Date(createTripDto.departureTime),
				arrivalTime: createTripDto.arrivalTime
					? new Date(createTripDto.arrivalTime)
					: null,
			},
			include: {
				route: true,
				bus: true,
				driver: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		});
	}

	async findAll(routeId?: string, driverId?: string, status?: string) {
		return this.prisma.trip.findMany({
			where: {
				...(routeId && { routeId }),
				...(driverId && { driverId }),
				...(status && { status: status as any }),
			},
			include: {
				route: true,
				bus: true,
				driver: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
				_count: {
					select: {
						bookings: true,
					},
				},
			},
			orderBy: {
				departureTime: "asc",
			},
		});
	}

	async findUpcoming(limit: number = 20) {
		return this.prisma.trip.findMany({
			where: {
				departureTime: {
					gte: new Date(),
				},
				status: {
					in: ["SCHEDULED", "IN_PROGRESS"],
				},
			},
			include: {
				route: true,
				bus: true,
				driver: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
			},
			orderBy: {
				departureTime: "asc",
			},
			take: limit,
		});
	}

	async findOne(id: string) {
		const trip = await this.prisma.trip.findUnique({
			where: { id },
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
				bookings: {
					include: {
						user: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
								phone: true,
							},
						},
					},
				},
			},
		});

		if (!trip) {
			throw new NotFoundException("Trip not found");
		}

		return trip;
	}

	async update(id: string, updateTripDto: UpdateTripDto) {
		await this.findOne(id);

		const data: any = { ...updateTripDto };
		if (updateTripDto.departureTime) {
			data.departureTime = new Date(updateTripDto.departureTime as string);
		}
		if (updateTripDto.arrivalTime) {
			data.arrivalTime = new Date(updateTripDto.arrivalTime as string);
		}
		if (updateTripDto.actualDeparture) {
			data.actualDeparture = new Date(updateTripDto.actualDeparture as string);
		}
		if (updateTripDto.actualArrival) {
			data.actualArrival = new Date(updateTripDto.actualArrival as string);
		}

		return this.prisma.trip.update({
			where: { id },
			data,
			include: {
				route: true,
				bus: true,
				driver: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		});
	}

	async remove(id: string) {
		await this.findOne(id);

		await this.prisma.trip.delete({
			where: { id },
		});

		return { message: "Trip deleted successfully" };
	}
}

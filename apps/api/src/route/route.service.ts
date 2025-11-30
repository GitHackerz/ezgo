import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRouteDto, UpdateRouteDto } from "./dto/route.dto";

@Injectable()
export class RouteService {
	constructor(private prisma: PrismaService) {}

	async create(createRouteDto: CreateRouteDto) {
		return this.prisma.route.create({
			data: createRouteDto,
			include: {
				company: {
					select: {
						id: true,
						name: true,
					},
				},
				origin: true,
				destination: true,
			},
		});
	}

	async findAll(companyId?: string, isActive?: boolean) {
		return this.prisma.route.findMany({
			where: {
				...(companyId && { companyId }),
				...(isActive !== undefined && { isActive }),
			},
			include: {
				company: {
					select: {
						id: true,
						name: true,
					},
				},
				origin: true,
				destination: true,
				_count: {
					select: {
						trips: true,
						favorites: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});
	}

	async findOne(id: string) {
		const route = await this.prisma.route.findUnique({
			where: { id },
			include: {
				company: {
					select: {
						id: true,
						name: true,
					},
				},
				origin: true,
				destination: true,
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
			},
		});

		if (!route) {
			throw new NotFoundException("Route not found");
		}

		return route;
	}

	async search(origin?: string, destination?: string) {
		return this.prisma.route.findMany({
			where: {
				isActive: true,
				AND: [
					origin
						? {
								OR: [
									{
										origin: { name: { contains: origin, mode: "insensitive" } },
									},
									{
										origin: { city: { contains: origin, mode: "insensitive" } },
									},
									{ name: { contains: origin, mode: "insensitive" } },
								],
							}
						: {},
					destination
						? {
								OR: [
									{
										destination: {
											name: { contains: destination, mode: "insensitive" },
										},
									},
									{
										destination: {
											city: { contains: destination, mode: "insensitive" },
										},
									},
									{ name: { contains: destination, mode: "insensitive" } },
								],
							}
						: {},
				],
			},
			include: {
				company: {
					select: {
						id: true,
						name: true,
					},
				},
				origin: true,
				destination: true,
			},
		});
	}

	async getPopular(limit: number = 10) {
		return this.prisma.route.findMany({
			where: {
				isActive: true,
			},
			include: {
				company: {
					select: {
						id: true,
						name: true,
					},
				},
				origin: true,
				destination: true,
				_count: {
					select: {
						trips: true,
						favorites: true,
					},
				},
			},
			orderBy: {
				favorites: {
					_count: "desc",
				},
			},
			take: limit,
		});
	}

	async update(id: string, updateRouteDto: UpdateRouteDto) {
		await this.findOne(id);

		return this.prisma.route.update({
			where: { id },
			data: updateRouteDto,
			include: {
				company: {
					select: {
						id: true,
						name: true,
					},
				},
				origin: true,
				destination: true,
			},
		});
	}

	async remove(id: string) {
		await this.findOne(id);

		await this.prisma.route.delete({
			where: { id },
		});

		return { message: "Route deleted successfully" };
	}
}

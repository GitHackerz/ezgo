import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { FilterLocationsDto } from "./dto/filter-locations.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class LocationService {
	constructor(private prisma: PrismaService) {}

	async create(createLocationDto: CreateLocationDto) {
		return this.prisma.location.create({
			data: createLocationDto,
		});
	}

	async findAll(filters?: FilterLocationsDto) {
		const where: any = {};

		if (filters?.city) {
			where.city = { contains: filters.city, mode: "insensitive" };
		}

		if (filters?.governorate) {
			where.governorate = {
				contains: filters.governorate,
				mode: "insensitive",
			};
		}

		if (filters?.type) {
			where.type = filters.type;
		}

		if (filters?.isActive !== undefined) {
			where.isActive = filters.isActive;
		}

		return this.prisma.location.findMany({
			where,
			orderBy: [{ governorate: "asc" }, { city: "asc" }, { name: "asc" }],
		});
	}

	async search(query: string) {
		return this.prisma.location.findMany({
			where: {
				OR: [
					{ name: { contains: query, mode: "insensitive" } },
					{ city: { contains: query, mode: "insensitive" } },
					{ governorate: { contains: query, mode: "insensitive" } },
					{ address: { contains: query, mode: "insensitive" } },
				],
				isActive: true,
			},
			orderBy: [{ governorate: "asc" }, { city: "asc" }, { name: "asc" }],
			take: 20, // Limit results for autocomplete
		});
	}

	async findOne(id: string) {
		return this.prisma.location.findUnique({
			where: { id },
			include: {
				routesAsOrigin: {
					select: { id: true, name: true },
				},
				routesAsDestination: {
					select: { id: true, name: true },
				},
			},
		});
	}

	async update(id: string, updateLocationDto: UpdateLocationDto) {
		return this.prisma.location.update({
			where: { id },
			data: updateLocationDto,
		});
	}

	async remove(id: string) {
		return this.prisma.location.delete({
			where: { id },
		});
	}
}

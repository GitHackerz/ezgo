import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { BusService } from "./bus.service";

describe("BusService", () => {
	let service: BusService;
	let _prismaService: PrismaService;

	const mockPrismaService = {
		bus: {
			create: jest.fn(),
			findMany: jest.fn(),
			findUnique: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BusService,
				{
					provide: PrismaService,
					useValue: mockPrismaService,
				},
			],
		}).compile();

		service = module.get<BusService>(BusService);
		_prismaService = module.get<PrismaService>(PrismaService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", () => {
		it("should create a new bus", async () => {
			const createBusDto = {
				plateNumber: "TUN-1234",
				model: "Mercedes Sprinter",
				capacity: 50,
				companyId: "company-1",
			};

			const expectedBus = {
				id: "1",
				...createBusDto,
				status: "ACTIVE",
			};

			mockPrismaService.bus.create.mockResolvedValue(expectedBus);

			const result = await service.create(createBusDto);

			expect(result).toEqual(expectedBus);
			expect(mockPrismaService.bus.create).toHaveBeenCalledWith({
				data: createBusDto,
			});
		});
	});

	describe("findNearby", () => {
		it("should return nearby buses", async () => {
			const buses = [
				{ id: "1", plateNumber: "TUN-1234", latitude: 36.8, longitude: 10.1 },
				{ id: "2", plateNumber: "TUN-5678", latitude: 36.85, longitude: 10.15 },
			];

			mockPrismaService.bus.findMany.mockResolvedValue(buses);

			const result = await service.findNearby(36.8, 10.1, 10);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});
	});
});

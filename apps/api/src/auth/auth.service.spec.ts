import { JwtService } from "@nestjs/jwt";
import { Test, type TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
	let service: AuthService;
	let _prismaService: PrismaService;
	let _jwtService: JwtService;

	const mockPrismaService = {
		user: {
			findUnique: jest.fn(),
			create: jest.fn(),
		},
	};

	const mockJwtService = {
		sign: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: PrismaService,
					useValue: mockPrismaService,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		_prismaService = module.get<PrismaService>(PrismaService);
		_jwtService = module.get<JwtService>(JwtService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("register", () => {
		it("should create a new user", async () => {
			const registerDto = {
				email: "test@example.com",
				password: "password123",
				firstName: "Test",
				lastName: "User",
				role: "PASSENGER" as any,
			};

			mockPrismaService.user.findUnique.mockResolvedValue(null);
			mockPrismaService.user.create.mockResolvedValue({
				id: "1",
				...registerDto,
				password: "hashed",
			});
			mockJwtService.sign.mockReturnValue("token");

			const result = await service.register(registerDto);

			expect(result).toHaveProperty("accessToken");
			expect(result).toHaveProperty("refreshToken");
			expect(mockPrismaService.user.create).toHaveBeenCalled();
		});

		it("should throw error if email already exists", async () => {
			const registerDto = {
				email: "existing@example.com",
				password: "password123",
				firstName: "Test",
				lastName: "User",
				role: "PASSENGER" as any,
			};

			mockPrismaService.user.findUnique.mockResolvedValue({ id: "1" });

			await expect(service.register(registerDto)).rejects.toThrow();
		});
	});

	describe("login", () => {
		it("should return tokens for valid credentials", async () => {
			const loginDto = {
				email: "test@example.com",
				password: "password123",
			};

			const user = {
				id: "1",
				email: loginDto.email,
				password: await bcrypt.hash(loginDto.password, 10),
				role: "PASSENGER",
			};

			mockPrismaService.user.findUnique.mockResolvedValue(user);
			mockJwtService.sign.mockReturnValue("token");

			const result = await service.login(loginDto);

			expect(result).toHaveProperty("accessToken");
			expect(result).toHaveProperty("refreshToken");
		});
	});
});

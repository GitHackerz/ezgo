import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@ApiTags("companies")
@Controller("company")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	@Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new company', description: 'Register a new bus company (admin only)' })
  @ApiResponse({ status: 201, description: 'Company successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateCompanyDto })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

	@Get()
	@ApiOperation({
		summary: "Get all companies",
		description: "Retrieve all registered bus companies",
	})
	@ApiResponse({ status: 200, description: "Companies retrieved successfully" })
	findAll() {
		return this.companyService.findAll();
	}

	@Get(':id')
  @ApiOperation({ summary: 'Get company by ID', description: 'Retrieve a specific company with details' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

	@Patch(":id")
	@Roles(Role.ADMIN, Role.COMPANY_ADMIN)
	@ApiOperation({
		summary: "Update company details",
		description: "Update company information",
	})
	@ApiResponse({ status: 200, description: "Company successfully updated" })
	@ApiResponse({ status: 404, description: "Company not found" })
	@ApiParam({ name: "id", description: "Company ID" })
	@ApiBody({ type: UpdateCompanyDto })
	update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
		return this.companyService.update(id, updateCompanyDto);
	}

	@Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a company', description: 'Remove a company from the system (admin only)' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}

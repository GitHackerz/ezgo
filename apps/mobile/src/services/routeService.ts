import api from "./api";

export interface Route {
	id: string;
	companyId: string;
	originCity: string;
	destinationCity: string;
	originStation: string;
	destinationStation: string;
	originLocation: { lat: number; lng: number };
	destinationLocation: { lat: number; lng: number };
	estimatedDuration: number;
	distance: number;
	basePrice: number;
	isActive: boolean;
	stops?: string[];
	createdAt: string;
	updatedAt: string;
	company?: {
		id: string;
		name: string;
		logo?: string;
	};
}

export interface SearchRoutesParams {
	originCity?: string;
	destinationCity?: string;
	date?: string;
}

export interface PopularRoute {
	originCity: string;
	destinationCity: string;
	tripCount: number;
	minPrice: number;
	avgDuration: number;
}

const routeService = {
	// Search routes
	async searchRoutes(params: SearchRoutesParams): Promise<Route[]> {
		const response = await api.get("/routes/search", { params });
		return response.data;
	},

	// Get all routes
	async getAllRoutes(): Promise<Route[]> {
		const response = await api.get("/routes");
		return response.data;
	},

	// Get route by ID
	async getRouteById(id: string): Promise<Route> {
		const response = await api.get(`/routes/${id}`);
		return response.data;
	},

	// Get popular routes
	async getPopularRoutes(): Promise<PopularRoute[]> {
		const response = await api.get("/routes/popular");
		return response.data;
	},

	// Get routes by company
	async getRoutesByCompany(companyId: string): Promise<Route[]> {
		const response = await api.get(`/routes/company/${companyId}`);
		return response.data;
	},

	// Get available cities for origin
	async getOriginCities(): Promise<string[]> {
		const response = await api.get("/routes/cities/origin");
		return response.data;
	},

	// Get available cities for destination (based on origin)
	async getDestinationCities(originCity?: string): Promise<string[]> {
		const params = originCity ? { originCity } : {};
		const response = await api.get("/routes/cities/destination", { params });
		return response.data;
	},
};

export default routeService;

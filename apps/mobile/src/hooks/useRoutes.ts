import { useCallback, useEffect, useState } from "react";
import routeService, {
	type PopularRoute,
	type Route,
} from "../services/routeService";

export function useRoutes() {
	const [routes, setRoutes] = useState<Route[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRoutes = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await routeService.getAllRoutes();
			setRoutes(data);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch routes";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRoutes();
	}, [fetchRoutes]);

	return { routes, isLoading, error, refetch: fetchRoutes };
}

export function usePopularRoutes() {
	const [routes, setRoutes] = useState<PopularRoute[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRoutes = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const data = await routeService.getPopularRoutes();
				setRoutes(data);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to fetch popular routes";
				setError(errorMessage);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRoutes();
	}, []);

	return { routes, isLoading, error };
}

export function useCities() {
	const [originCities, setOriginCities] = useState<string[]>([]);
	const [destinationCities, setDestinationCities] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchOriginCities = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await routeService.getOriginCities();
			setOriginCities(data);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch cities";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetchDestinationCities = useCallback(async (originCity?: string) => {
		setIsLoading(true);
		try {
			const data = await routeService.getDestinationCities(originCity);
			setDestinationCities(data);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch cities";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOriginCities();
	}, [fetchOriginCities]);

	return {
		originCities,
		destinationCities,
		isLoading,
		error,
		fetchDestinationCities,
	};
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG, ENDPOINTS } from "../config/api";

// Create axios instance
const apiClient = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	timeout: API_CONFIG.TIMEOUT,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const token = await AsyncStorage.getItem("accessToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		// Handle 401 Unauthorized - try to refresh token
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = await AsyncStorage.getItem("refreshToken");
				if (refreshToken) {
					const response = await axios.post(
						`${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
						{ refreshToken },
					);

					const { accessToken, refreshToken: newRefreshToken } = response.data;

					await AsyncStorage.setItem("accessToken", accessToken);
					await AsyncStorage.setItem("refreshToken", newRefreshToken);

					originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					return apiClient(originalRequest);
				}
			} catch {
				// Refresh failed, clear tokens and redirect to login
				await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
				// The auth context will handle the redirect
			}
		}

		return Promise.reject(error);
	},
);

export default apiClient;

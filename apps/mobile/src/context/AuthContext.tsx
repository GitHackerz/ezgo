import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	type AuthResponse,
	authService,
	type LoginRequest,
	type RegisterRequest,
	type User,
} from "../services/authService";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (credentials: LoginRequest) => Promise<void>;
	register: (data: RegisterRequest) => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const checkAuthState = useCallback(async () => {
		try {
			const token = await AsyncStorage.getItem("accessToken");
			const storedUser = await AsyncStorage.getItem("user");

			if (token && storedUser) {
				setUser(JSON.parse(storedUser));
				// Optionally verify token by fetching user profile
				try {
					const freshUser = await authService.getMe();
					setUser(freshUser);
					await AsyncStorage.setItem("user", JSON.stringify(freshUser));
				} catch {
					// Token might be invalid, but keep local user for now
					// The API interceptor will handle token refresh
				}
			}
		} catch (error) {
			console.error("Error checking auth state:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Check for existing token on app start
	useEffect(() => {
		checkAuthState();
	}, [checkAuthState]);

	const storeAuthData = async (authResponse: AuthResponse) => {
		await AsyncStorage.setItem("accessToken", authResponse.accessToken);
		await AsyncStorage.setItem("refreshToken", authResponse.refreshToken);
		await AsyncStorage.setItem("user", JSON.stringify(authResponse.user));
		setUser(authResponse.user);
	};

	const login = async (credentials: LoginRequest) => {
		setIsLoading(true);
		try {
			const response = await authService.login(credentials);
			await storeAuthData(response);
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (data: RegisterRequest) => {
		setIsLoading(true);
		try {
			const response = await authService.register(data);
			await storeAuthData(response);
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		try {
			await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const refreshUser = async () => {
		try {
			const freshUser = await authService.getMe();
			setUser(freshUser);
			await AsyncStorage.setItem("user", JSON.stringify(freshUser));
		} catch (error) {
			console.error("Error refreshing user:", error);
		}
	};

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated: !!user,
		login,
		register,
		logout,
		refreshUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

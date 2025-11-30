"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface ApiError extends Error {
	status?: number;
}

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => {
		const client = new QueryClient({
			defaultOptions: {
				queries: {
					retry: (failureCount, error: ApiError) => {
						// Don't retry on 401/403 errors
						if (error?.status === 401 || error?.status === 403) {
							return false;
						}
						return failureCount < 3;
					},
				},
				mutations: {
					retry: (failureCount, error: ApiError) => {
						// Don't retry on 401/403 errors
						if (error?.status === 401 || error?.status === 403) {
							return false;
						}
						return failureCount < 3;
					},
					onError: (error: ApiError) => {
						// Automatically logout on 401/403 errors
						if (error?.status === 401 || error?.status === 403) {
							signOut({ callbackUrl: "/auth/login" });
						}
					},
				},
			},
		});
		return client;
	});

	return (
		<SessionProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}

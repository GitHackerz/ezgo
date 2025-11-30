import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:4050";

function decodeJWT(token: string) {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload;
	} catch {
		return null;
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password are required");
				}

				try {
					const response = await axios.post(`${SERVER_URL}/auth/login`, {
						email: credentials.email,
						password: credentials.password,
					});

					const user = response.data;

					if (user?.accessToken) {
						// Return the user object with the token
						return {
							id: user.user.id,
							name: `${user.user.firstName} ${user.user.lastName}`,
							email: user.user.email,
							role: user.user.role,
							accessToken: user.accessToken,
							refreshToken: user.refreshToken,
						};
					}
					throw new Error("Invalid response from server");
				} catch (error: any) {
					// Throw the backend error message
					const message =
						error.response?.data?.message || error.message || "Login failed";
					throw new Error(message);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }: any) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.accessToken = user.accessToken;
				token.refreshToken = user.refreshToken;
			}

			// Verify the access token
			if (token.accessToken) {
				const payload = decodeJWT(token.accessToken);
				if (!payload || payload.exp * 1000 < Date.now()) {
					// Token is invalid or expired, sign out by returning null
					return null;
				}
			}

			return token;
		},
		async session({ session, token }: any) {
			if (session.user) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.accessToken = token.accessToken;
			}
			return session;
		},
	},
	pages: {
		signIn: "/auth/login",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET || "super-secret-secret",
};

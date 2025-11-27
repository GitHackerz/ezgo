import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

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
							token: user.accessToken,
							refreshToken: user.refreshToken,
						};
					}
					return null;
				} catch (error) {
					console.error("Login failed:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }: any) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.token = user.token;
				token.refreshToken = user.refreshToken;
			}
			return token;
		},
		async session({ session, token }: any) {
			if (session.user) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.token = token.token;
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

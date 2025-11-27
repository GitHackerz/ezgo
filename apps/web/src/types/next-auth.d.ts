import "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name: string;
			email: string;
			role: string;
			accessToken: string;
		};
	}

	interface User {
		id: string;
		name: string;
		email: string;
		role: string;
		accessToken: string;
		refreshToken: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role: string;
		accessToken: string;
		refreshToken: string;
	}
}

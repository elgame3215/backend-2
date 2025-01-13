import { config } from "dotenv";

config();

export const CONFIG = {
	PORT: process.env.PORT,
	MONGO_CLUSTER_URL: process.env.MONGO_CLUSTER_URL,
	JWT_SECRET: process.env.JWT_SECRET,
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
export const POLICIES = {
	public: 'public',
	user: 'user',
	admin: 'admin',
};

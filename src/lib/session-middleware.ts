"use server";
import "server-only";
import {
	Account,
	Client,
	Databases,
	Databases as DatabasesType,
	Models,
	Storage,
	type Account as AccountType,
	type Storage as StorageType,
	type Users as UsersTypes,
} from "node-appwrite";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import envConfig from "@/configs/env";
import { AUTH_COOKIE } from "@/features/auth/constants";

type AdditionalContext = {
	Variables: {
		account: AccountType;
		databases: DatabasesType;
		storage: StorageType;
		users: UsersTypes;
		user: Models.User<Models.Preferences>;
	};
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
	async (c, next) => {
		const client = new Client()
			.setEndpoint(envConfig.APPWRITE_ENDPOINT)
			.setProject(envConfig.APPWRITE_PROJECT);

		const session = getCookie(c, AUTH_COOKIE);

		if (!session) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		client.setSession(session);

		const account = new Account(client);
		const databases = new Databases(client);
		const storage = new Storage(client);
		const user = await account.get();

		c.set("account", account);
		c.set("databases", databases);
		c.set("storage", storage);
		c.set("user", user);

		await next();
	}
);

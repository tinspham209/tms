import envConfig from "@/configs/env";
import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE } from "./constants";

export const getCurrent = async () => {
	try {
		const client = new Client()
			.setEndpoint(envConfig.APPWRITE_ENDPOINT)
			.setProject(envConfig.APPWRITE_PROJECT);

		const session = (await cookies()).get(AUTH_COOKIE);

		if (!session) {
			return null;
		}

		client.setSession(session.value);

		const account = new Account(client);
		return await account.get();
	} catch {
		return null;
	}
};

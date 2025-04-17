"use server";
import "server-only";

import envConfig from "@/configs/env";
import { Client, Account, Databases, Storage } from "node-appwrite";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/features/auth/constants";

export async function createSessionClient() {
	const client = new Client()
		.setEndpoint(envConfig.APPWRITE_ENDPOINT)
		.setProject(envConfig.APPWRITE_PROJECT);

	const session = (await cookies()).get(AUTH_COOKIE);
	if (!session || !session.value) {
		return new Error("Unauthorized");
	}

	client.setSession(session.value);

	return {
		get account() {
			return new Account(client);
		},
		get databases() {
			return new Databases(client);
		},
	};
}

export async function createAdminClient() {
	const client = new Client()
		.setEndpoint(envConfig.APPWRITE_ENDPOINT)
		.setProject(envConfig.APPWRITE_PROJECT)
		.setKey(envConfig.APPWRITE_KEY);

	return {
		get account() {
			return new Account(client);
		},
		get databaes() {
			return new Databases(client);
		},
		get storage() {
			return new Storage(client);
		},
	};
}

export type ErrorAppwrite = {
	code: number;
	name: string;
	response: string;
	type: string;
};

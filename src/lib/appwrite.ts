"use server";
import "server-only";

import envConfig from "@/configs/env";
import { Client, Account } from "node-appwrite";

export async function createAdminClient() {
	const client = new Client()
		.setEndpoint(envConfig.APPWRITE_ENDPOINT)
		.setProject(envConfig.APPWRITE_PROJECT)
		.setKey(envConfig.APPWRITE_KEY);

	return {
		get account() {
			return new Account(client);
		},
	};
}

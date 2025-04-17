import envConfig from "@/configs/env";
import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE } from "../auth/constants";
import { getMember } from "../members/utils";
import { Workspace } from "./schemas";

export const getWorkspaces = async () => {
	try {
		const client = new Client()
			.setEndpoint(envConfig.APPWRITE_ENDPOINT)
			.setProject(envConfig.APPWRITE_PROJECT);

		const session = (await cookies()).get(AUTH_COOKIE);

		if (!session) {
			return null;
		}

		client.setSession(session.value);

		const databases = new Databases(client);
		const account = new Account(client);
		const user = await account.get();

		const members = await databases.listDocuments(
			envConfig.APPWRITE_DATABASE_ID,
			envConfig.APPWRITE_MEMBERS_ID,
			[Query.equal("userId", user.$id)]
		);

		if (members.total === 0) {
			return { documents: [], total: 0 };
		}

		const workspaceIds = members.documents.map((member) => member.workspaceId);

		const workspaces = await databases.listDocuments(
			envConfig.APPWRITE_DATABASE_ID,
			envConfig.APPWRITE_WORKSPACES_ID,
			[Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
		);

		return workspaces;
	} catch {
		return { documents: [], total: 0 };
	}
};

export const getWorkspace = async ({
	workspaceId,
}: {
	workspaceId: string;
}) => {
	try {
		const client = new Client()
			.setEndpoint(envConfig.APPWRITE_ENDPOINT)
			.setProject(envConfig.APPWRITE_PROJECT);

		const session = (await cookies()).get(AUTH_COOKIE);

		if (!session) {
			return null;
		}

		client.setSession(session.value);

		const databases = new Databases(client);

		const account = new Account(client);
		const user = await account.get();

		const member = await getMember({
			databases,
			userId: user.$id,
			workspaceId,
		});

		if (!member) {
			return null;
		}
		if (member.workspaceId !== workspaceId) {
			return null;
		}

		const workspace = await databases.getDocument<Workspace>(
			envConfig.APPWRITE_DATABASE_ID,
			envConfig.APPWRITE_WORKSPACES_ID,
			workspaceId
		);

		return workspace;
	} catch {
		return null;
	}
};

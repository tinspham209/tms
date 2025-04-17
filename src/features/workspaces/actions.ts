import envConfig from "@/configs/env";
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { getMember } from "../members/utils";
import { Workspace } from "./schemas";

export const getWorkspaces = async () => {
	try {
		const sessionClient = await createSessionClient();
		if (sessionClient instanceof Error) {
			throw sessionClient;
		}
		const { account, databases } = sessionClient;
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
		const sessionClient = await createSessionClient();
		if (sessionClient instanceof Error) {
			throw sessionClient;
		}
		const { account, databases } = sessionClient;
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

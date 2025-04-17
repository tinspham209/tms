import envConfig from "@/configs/env";
import { Query, type Databases as DatabasesType } from "node-appwrite";

interface GetMemberProps {
	databases: DatabasesType;
	workspaceId: string;
	userId: string;
}

export const getMember = async ({
	databases,
	workspaceId,
	userId,
}: GetMemberProps) => {
	const members = await databases.listDocuments(
		envConfig.APPWRITE_DATABASE_ID,
		envConfig.APPWRITE_MEMBERS_ID,
		[Query.equal("workspaceId", workspaceId), Query.equal("userId", userId)]
	);
	const member = members.documents[0];

	if (!member) {
		throw new Error("Member not found");
	}
	if (member.workspaceId !== workspaceId) {
		throw new Error("Member not found");
	}
	if (member.userId !== userId) {
		throw new Error("Member not found");
	}
	if (member.role !== "ADMIN") {
		throw new Error("Unauthorized");
	}
	return member;
};

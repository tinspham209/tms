import envConfig from "@/configs/env";
import { MemberRole } from "@/features/members/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Models, Query } from "node-appwrite";
import { createWorkSpaceSchema } from "../schemas";
import { generateInviteCode } from "@/lib/utils";

const app = new Hono()
	.get("/", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");

		const members = await databases.listDocuments(
			envConfig.APPWRITE_DATABASE_ID,
			envConfig.APPWRITE_MEMBERS_ID,
			[Query.equal("userId", user.$id)]
		);

		if (members.total === 0) {
			return c.json({ data: { documents: [], total: 0 }, success: true });
		}

		const workspaceIds = members.documents.map((member) => member.workspaceId);

		const workspaces = await databases.listDocuments(
			envConfig.APPWRITE_DATABASE_ID,
			envConfig.APPWRITE_WORKSPACES_ID,
			[Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
		);

		return c.json({ data: workspaces, success: true });
	})
	.post(
		"/",
		zValidator("form", createWorkSpaceSchema),
		sessionMiddleware,
		async (c) => {
			const databases = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");

			const { name, image } = c.req.valid("form");

			let workspace;

			let file: Models.File | undefined;
			if (image instanceof File) {
				try {
					file = await storage.createFile(
						envConfig.APPWRITE_BUCKET_ID,
						ID.unique(),
						image
					);
				} catch (error: any) {
					return c.json(
						{ error: error, message: "Failed to storage.createFile" },
						error?.code
					);
				}
			}

			try {
				workspace = await databases.createDocument(
					envConfig.APPWRITE_DATABASE_ID,
					envConfig.APPWRITE_WORKSPACES_ID,
					ID.unique(),
					{
						name,
						userId: user.$id,
						imageId: file ? file.$id : "",
						inviteCode: generateInviteCode(),
					}
				);
			} catch (error: any) {
				return c.json(
					{ error, message: "Failed to databases.createDocument workspace" },
					error?.code
				);
			}
			let member;

			try {
				member = await databases.createDocument(
					envConfig.APPWRITE_DATABASE_ID,
					envConfig.APPWRITE_MEMBERS_ID,
					ID.unique(),
					{
						userId: user.$id,
						workspaceId: workspace.$id,
						role: MemberRole.ADMIN,
					}
				);
			} catch (error: any) {
				return c.json(
					{ error, message: "Failed to databases.createDocument member" },
					error?.code
				);
			}

			return c.json({ data: workspace, success: true });
		}
	);

export default app;

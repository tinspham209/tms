import envConfig from "@/configs/env";
import { MemberRole } from "@/features/members/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Models, Query } from "node-appwrite";
import {
	createWorkspaceSchema,
	updateWorkspaceSchema,
	Workspace,
} from "../schemas";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";

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
		zValidator("form", createWorkspaceSchema),
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

			return c.json({
				data: {
					...workspace,
					member,
				},
				success: true,
			});
		}
	)
	.patch(
		"/:workspaceId",
		sessionMiddleware,
		zValidator("form", updateWorkspaceSchema),
		async (c) => {
			const databases = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");

			const { workspaceId } = c.req.param();
			const { name, image } = c.req.valid("form");

			let member: Models.Document | undefined;
			try {
				member = await getMember({
					databases,
					workspaceId,
					userId: user.$id,
				});
			} catch (error: any) {
				return c.json(
					{ error, message: "Failed to get member" },
					error?.code || 401
				);
			}

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

			let workspace;
			try {
				workspace = await databases.updateDocument(
					envConfig.APPWRITE_DATABASE_ID,
					envConfig.APPWRITE_WORKSPACES_ID,
					workspaceId,
					{
						name,
						imageId: file ? file.$id : typeof image === "string" ? image : "",
					}
				);
			} catch (error: any) {
				return c.json(
					{ error, message: "Failed to databases.updateDocument workspace" },
					error?.code
				);
			}

			return c.json({
				data: {
					...workspace,
					member: {
						...member,
						workspaceId: workspace.$id,
					},
				},
				success: true,
			});
		}
	)
	.get("/:workspaceId", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { workspaceId } = c.req.param();

		let member;
		try {
			member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
		} catch (error: any) {
			return c.json({ error: error.message, message: error.message }, 401);
		}

		const workspace = await databases.getDocument<Workspace>(
			envConfig.APPWRITE_DATABASE_ID,
			envConfig.APPWRITE_WORKSPACES_ID,
			workspaceId
		);
		if (!workspace) {
			return c.json(
				{ error: "Workspace not found", message: "Workspace not found" },
				401
			);
		}
		return c.json({
			data: {
				...workspace,
				member: {
					...member,
					workspaceId: workspace.$id,
				},
			},
			success: true,
		});
	});

export default app;

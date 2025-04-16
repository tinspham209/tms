import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkSpaceSchema } from "../schemas";
import envConfig from "@/configs/env";
import { ID, Models } from "node-appwrite";
import { compressImage } from "@/lib/compressor";

const app = new Hono()
	.get("/", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const storage = c.get("storage");

		const workspaces = await databases.listDocuments(
			envConfig.APPWRITE_DATABASE_ID,
			envConfig.APPWRITE_WORKSPACES_ID
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
					}
				);
			} catch (error: any) {
				return c.json(
					{ error, message: "Failed to databases.createDocument" },
					error?.code
				);
			}

			return c.json({ data: workspace, success: true });
		}
	);

export default app;

import envConfig from "@/configs/env";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";

const app = new Hono().get("/:fileId", sessionMiddleware, async (c) => {
	const storage = c.get("storage");

	const fileId = c.req.param("fileId");

	let uploadedImageUrl: string | undefined;

	await storage
		.getFileDownload(envConfig.APPWRITE_BUCKET_ID, fileId)
		.then((res) => {
			const bufferUrl = Buffer.from(res).toString("base64");

			uploadedImageUrl = `data:image/webp;base64,${bufferUrl}`;
		})
		.catch((error) => {
			console.error(error);
			throw new Error(`Failed to storage.getFileDownload`);
		});

	return c.json({
		data: {
			url: uploadedImageUrl,
		},
		success: true,
	});
});

export default app;

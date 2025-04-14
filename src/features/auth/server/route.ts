import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { loginSchema, signupSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
	.get("/current", sessionMiddleware, async (c) => {
		const user = c.get("user");
		return c.json({ data: user });
	})
	.post("/login", zValidator("json", loginSchema), async (c) => {
		const { email, password } = c.req.valid("json");

		const { account } = await createAdminClient();

		let session;
		try {
			session = await account.createEmailPasswordSession(email, password);
		} catch (error) {
			return c.json({ error }, 400);
		}

		setCookie(c, AUTH_COOKIE, session.secret, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 30, // 30 days
		});

		return c.json({ success: true });
	})
	.post("/register", zValidator("json", signupSchema), async (c) => {
		const { email, password, name } = c.req.valid("json");

		const { account } = await createAdminClient();

		let user, session;
		try {
			user = await account.create(ID.unique(), email, password, name);
			session = await account.createEmailPasswordSession(email, password);
		} catch (error) {
			return c.json({ error }, 400);
		}

		setCookie(c, AUTH_COOKIE, session.secret, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 30, // 30 days
		});

		return c.json({ success: true, data: user });
	})
	.post("/logout", sessionMiddleware, async (c) => {
		const account = c.get("account");

		deleteCookie(c, AUTH_COOKIE);

		await account.deleteSession("current");

		return c.json({ success: true });
	});

export default app;

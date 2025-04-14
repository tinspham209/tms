import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { loginSchema, signupSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { AUTH_COOKIE } from "../constants";

const app = new Hono()
	.post("/login", zValidator("json", loginSchema), async (c) => {
		const { email, password } = c.req.valid("json");

		const { account } = await createAdminClient();

		const session = await account.createEmailPasswordSession(email, password);

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
		const user = await account.create(ID.unique(), email, password, name);

		const session = await account.createEmailPasswordSession(email, password);

		setCookie(c, AUTH_COOKIE, session.secret, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 30, // 30 days
		});

		return c.json({ success: true, data: user });
	})
	.post("/logout", (c) => {
		deleteCookie(c, AUTH_COOKIE);
		return c.json({ success: true });
	});

export default app;

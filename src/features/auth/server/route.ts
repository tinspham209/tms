import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { loginSchema, signupSchema } from "../schemas";

const app = new Hono()
	.post("/login", zValidator("json", loginSchema), async (c) => {
		const { email, password } = c.req.valid("json");

		return c.json({ email, password });
	})
	.post("/register", zValidator("json", signupSchema), async (c) => {
		const { email, password, name } = c.req.valid("json");
		return c.json({ email, password, name });
	});

export default app;

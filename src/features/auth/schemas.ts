import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().trim().min(1, "Required").email(),
	password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
	name: z.string().trim().min(1, "Required"),
	email: z.string().trim().min(1, "Required").email(),
	password: z.string().min(4, "Minimum 4 characters required"),
});

export type SignupSchema = z.infer<typeof signupSchema>;

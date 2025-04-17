import { Models } from "node-appwrite";
import { z } from "zod";

export type Workspace = Models.Document & {
	name: string;
	imageId: string;
	inviteCode: string;
	userId: string;
};

export const createWorkspaceSchema = z.object({
	name: z.string().trim().min(1, "Required"),
	image: z.union([
		z.instanceof(File).nullable(),
		z
			.string()
			.transform((value) => (value === "" ? undefined : value))
			.optional(),
	]),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema> &
	Partial<Workspace>;

export const updateWorkspaceSchema = z.object({
	name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
	image: z.union([
		z.instanceof(File).nullable(),
		z
			.string()
			.transform((value) => (value === "" ? undefined : value))
			.optional(),
	]),
});

export type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema> &
	Partial<Workspace>;

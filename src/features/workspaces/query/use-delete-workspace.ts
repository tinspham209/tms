import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { redirect, useRouter } from "next/navigation";
import { Models } from "node-appwrite";
import { toast } from "sonner";

type ResponseType = InferResponseType<
	(typeof client.api.workspaces)[":workspaceId"]["$delete"],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {
	const router = useRouter();

	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param }) => {
			const response = await client.api.workspaces[":workspaceId"]["$delete"]({
				param,
			});
			if (!response.ok) {
				throw new Error("Can't delete workspace");
			}
			return await response.json();
		},
		onSuccess: (data: any) => {
			const workspace: Models.Document = data?.data;
			const workspaceId = workspace.$id;

			toast.success("Workspace deleted");
			queryClient.invalidateQueries({ queryKey: ["workspaces"] });
			queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
			router.push("/");
		},
		onError: (error) => {
			toast.error(`Failed to delete workspace: ${error?.message}`);
		},
	});
	return mutation;
};

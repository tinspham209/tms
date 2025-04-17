import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { Models } from "node-appwrite";
import { toast } from "sonner";

type ResponseType = InferResponseType<
	(typeof client.api.workspaces)[":workspaceId"]["$patch"],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
	const router = useRouter();

	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ form, param }) => {
			const response = await client.api.workspaces[":workspaceId"]["$patch"]({
				form,
				param,
			});
			if (!response.ok) {
				throw new Error("Can't update workspace");
			}
			return await response.json();
		},
		onSuccess: (data: any) => {
			const workspace: Models.Document = data?.data;
			const workspaceId = workspace.$id;

			toast.success("Workspace updated");
			router.refresh();
			queryClient.invalidateQueries({ queryKey: ["workspaces"] });
			queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
		},
		onError: (error) => {
			toast.error(`Failed to update workspace: ${error?.message}`);
		},
	});
	return mutation;
};

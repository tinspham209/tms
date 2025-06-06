import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
	(typeof client.api.auth.register)["$post"]
>;
type RequestType = InferRequestType<
	(typeof client.api.auth.register)["$post"]
>["json"];

export const useRegister = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.auth.register["$post"]({ json });
			if (!response.ok) {
				throw new Error("Registration failed");
			}
			return await response.json();
		},
		onSuccess: () => {
			toast.success("Registration successful");
			router.refresh();
			queryClient.invalidateQueries({ queryKey: ["current"] });
		},
		onError: () => {
			toast.error("Registration failed");
		},
	});
	return mutation;
};

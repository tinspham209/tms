import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Workspace } from "../schemas";

type UseGetWorkSpaceParams = {
	defaultParams?: {
		workspaceId: string;
	};
};

export const useGetWorkspace = ({ defaultParams }: UseGetWorkSpaceParams) => {
	const [params, setParams] =
		useState<UseGetWorkSpaceParams["defaultParams"]>(defaultParams);

	const query = useQuery({
		queryKey: ["workspaces", params?.workspaceId],
		enabled: !!params?.workspaceId,
		queryFn: async () => {
			const response = await client.api.workspaces[":workspaceId"]["$get"]({
				param: {
					workspaceId: params?.workspaceId || "",
				},
			});

			if (!response.ok) {
				throw new Error("Can't get workspaces");
			}
			const { data } = await response.json();
			return data;
		},
	});

	const workspace: Workspace = (query.data as any) || {};

	return {
		...query,
		params,
		setParams,
		workspace,
	};
};

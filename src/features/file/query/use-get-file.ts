import envConfig from "@/configs/env";
import { client } from "@/lib/rpc";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Client, Storage } from "node-appwrite";
import { useState } from "react";

type GetFileResponse = {
	data: {
		url: string;
	};
	success: boolean;
};

type UseGetFileParams = {
	defaultParams?: {
		fileId: string;
	};
};

export const useGetFile = ({
	defaultParams = { fileId: "" },
}: UseGetFileParams) => {
	const [params, setParams] =
		useState<UseGetFileParams["defaultParams"]>(defaultParams);

	const query = useQuery({
		queryKey: ["file", params?.fileId],
		enabled: !!params?.fileId,
		queryFn: async () => {
			const response = await client.api.file[":fileId"]["$get"]({
				param: {
					fileId: params?.fileId || "",
				},
			});
			if (!response.ok) {
				throw new Error("Can't get file");
			}
			const { data } = await response.json();
			return data;
		},
		select(data) {
			return data.url;
		},
	});
	return {
		...query,
		params,
		setParams,
	};
};

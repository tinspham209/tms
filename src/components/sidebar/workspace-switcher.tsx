"use client";

import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspaces } from "@/features/workspaces/query/use-get-workspaces";
import { useRouter } from "next/navigation";
import { FaPlusCircle } from "react-icons/fa";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

const WorkspaceSwitcher = () => {
	const router = useRouter();
	const { workspaceId } = useWorkspaceId();
	const { data: workspaces, isLoading } = useGetWorkspaces();
	const { open } = useCreateWorkspaceModal();

	const onSelect = (id: string) => {
		router.push(`/workspaces/${id}`);
	};

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex items-center justify-between">
				<p className="text-xs uppercase text-neutral-500">Workspace</p>
				<FaPlusCircle
					onClick={open}
					className="size-5 text-neutral-500 cursor-pointer hover:opacity-75"
				/>
			</div>
			<Select
				onValueChange={onSelect}
				value={workspaceId as string}
				disabled={isLoading}
			>
				<SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
					<SelectValue placeholder="Select a workspace" />
				</SelectTrigger>
				<SelectContent>
					{workspaces?.documents.map((workspace) => (
						<SelectItem key={workspace.$id} value={workspace.$id}>
							<div className="flex justify-start items-center gap-3 font-medium">
								<WorkspaceAvatar
									name={workspace.name}
									imageId={workspace.imageId}
								/>
								<span className="truncate">{workspace.name}</span>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default WorkspaceSwitcher;

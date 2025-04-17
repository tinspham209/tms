"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import WorkspaceSettingDangerZone from "@/features/workspaces/components/workspace-settings-danger-zone";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/query/use-get-workspace";
import { isEmpty } from "@/lib/utils";

export const WorkspaceIdSettingsClient = () => {
	const { workspaceId } = useWorkspaceId();

	const { workspace, isLoading } = useGetWorkspace({
		defaultParams: {
			workspaceId: workspaceId as string,
		},
	});

	if (isLoading) return <PageLoader />;

	if (isEmpty(workspace)) return <PageError message="Workspace not found" />;

	return (
		<div className="w-full lg:max-w-xl flex flex-col gap-y-4">
			<CreateWorkspaceForm workspaceId={workspaceId as string} />
			<WorkspaceSettingDangerZone workspace={workspace} />
		</div>
	);
};

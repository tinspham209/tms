import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { FC } from "react";
import { Workspace } from "../schemas";
import { useDeleteWorkspace } from "../query/use-delete-workspace";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
	workspace: Workspace;
};

const WorkspaceSettingDangerZone = ({ workspace }: Props) => {
	const { mutate: onDelete, isPending: isDeletingWorkspace } =
		useDeleteWorkspace();

	const [DeleteDialog, confirmDelete] = useConfirm(
		"Delete workspace",
		"This action cannot be undone",
		"destructive"
	);

	const handleDelete = async () => {
		if (!workspace) {
			return;
		}
		const ok = await confirmDelete();

		if (!ok) return;

		onDelete({
			param: {
				workspaceId: workspace.$id,
			},
		});
	};

	const isLoading = isDeletingWorkspace;

	return (
		<>
			<DeleteDialog />
			<Card className="w-full h-full border-none shadow-none">
				<CardContent className="p-7">
					<div className="flex flex-col">
						<h3 className="font-bold">Danger Zone</h3>
						<p className="text-sm text-muted-foreground">
							Deleting a workspace is a irreversible and will remove all
							associated data
						</p>
						<DottedSeparator className="py-7" />
						<Button
							size="sm"
							type="button"
							variant="destructive"
							className="mt-6 w-fit ml-auto"
							disabled={isLoading}
							onClick={handleDelete}
						>
							Delete Workspace
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default WorkspaceSettingDangerZone;

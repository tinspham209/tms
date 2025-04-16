"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";
import { CreateWorkspaceForm } from "./create-workspace-form";

const CreateWorkspaceModal = () => {
	const { isOpen, setIsOpen } = useCreateWorkspaceModal();
	return (
		<ResponsiveModal
			title="Create a new workspace"
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<CreateWorkspaceForm />
		</ResponsiveModal>
	);
};

export default CreateWorkspaceModal;

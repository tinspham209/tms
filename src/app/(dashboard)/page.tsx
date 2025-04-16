import { getCurrent } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { useGetWorkspaces } from "@/features/workspaces/query/use-get-workspaces";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const user = await getCurrent();

	if (!user) {
		redirect("/sign-in");
	}

	return (
		<div className="">
			<CreateWorkspaceForm />
		</div>
	);
}

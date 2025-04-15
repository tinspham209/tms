import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const user = await getCurrent();

	if (!user) {
		redirect("/sign-in");
	}

	return <div className="">This is dashboard</div>;
}

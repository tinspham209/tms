import { getCurrent } from "@/features/auth/actions";
import UserButton from "@/features/auth/components/user-button";
import { redirect } from "next/navigation";

export default async function Home() {
	const user = await getCurrent();

	if (!user) {
		redirect("/sign-in");
	}

	return (
		<div className="flex flex-col items-center justify-between p-24">
			<UserButton />
		</div>
	);
}

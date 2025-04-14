"use client";

import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/query/use-current";
import { useLogout } from "@/features/auth/query/use-logout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();

	const { data, isLoading } = useCurrent();
	const { mutate } = useLogout();

	useEffect(() => {
		if (!data && !isLoading) {
			router.push("/sign-in");
		}
	}, [data]);

	const onLogout = () => {
		mutate();
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-between p-24">
			<h2>Only Authorized Users can view</h2>
			{data && JSON.stringify(data)}
			<Button onClick={onLogout}>Logout</Button>
		</div>
	);
}

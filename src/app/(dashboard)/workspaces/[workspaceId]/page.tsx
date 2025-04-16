import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import React, { FC, ReactNode } from "react";

type Props = {
	children?: ReactNode;
};

const Page = async ({}: Props) => {
	const user = await getCurrent();

	if (!user) {
		redirect("/sign-in");
	}

	return <div>Page</div>;
};

export default Page;

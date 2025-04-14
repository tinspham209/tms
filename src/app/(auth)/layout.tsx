"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
	const pathname = usePathname();
	const isSignInPathname = pathname === "/sign-up";

	return (
		<main className="bg-neutral-100 min-h-screen">
			<div className="mx-auto max-w-screen-2xl p-4">
				<nav className="flex justify-between items-center">
					<Image src="/globe.svg" alt="logo" width={56} height={56} />
					<Link href={isSignInPathname ? "/sign-in" : "/sign-up"}>
						<Button variant="secondary">
							{isSignInPathname ? "Sign In" : "Sign Up"}
						</Button>
					</Link>
				</nav>
				<div className="flex flex-col items-center justify-center pt-4 md:pt-14">
					{children}
				</div>
			</div>
		</main>
	);
};

export default AuthLayout;

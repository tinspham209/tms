import { cn } from "@/lib/utils";

import Link from "next/link";
import { navigationRoutes } from "./sidebar.helpers";

export const Navigation = () => {
	return (
		<ul>
			{navigationRoutes.map((route) => {
				const isActive = false;
				// const isDisabled = route.disabled;
				const Icon = isActive ? route.activeIcon : route.icon;
				return (
					<Link href={route.href} key={route.href}>
						<div
							className={cn(
								"flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
								isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
								// isDisabled && "cursor-not-allowed opacity-50"
							)}
						>
							<Icon className="size-5 text-neutral-500" />
							{route.label}
						</div>
					</Link>
				);
			})}
		</ul>
	);
};

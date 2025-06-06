import UserButton from "@/features/auth/components/user-button";
import { MobileSidebar } from "../sidebar/sidebar-mobile";

export const Navbar = () => {
	return (
		<nav className="py-3 px-6 flex items-center justify-between">
			<div className="flex-col hidden lg:flex">
				<h1 className="text-2xl font-semibold">Home</h1>
				<p className="text-muted-foreground">
					Monitor all your projects and tasks
				</p>
			</div>
			<MobileSidebar />
			<UserButton />
		</nav>
	);
};

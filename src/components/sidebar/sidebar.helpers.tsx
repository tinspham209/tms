import { Settings } from "lucide-react";
import {
	GoHome,
	GoHomeFill,
	GoCheckCircle,
	GoCheckCircleFill,
	GoPeople,
} from "react-icons/go";
import { IconType } from "react-icons/lib";

export type NavigationRoute = {
	href: string;
	label: string;
	icon: IconType;
	activeIcon: IconType;
	disabled?: boolean;
};

export const navigationRoutes: NavigationRoute[] = [
	{
		href: "/",
		label: "Home",
		icon: GoHome,
		activeIcon: GoHomeFill,
	},
	{
		href: "/tasks",
		label: "My Tasks",
		icon: GoCheckCircle,
		activeIcon: GoCheckCircleFill,
	},
	{
		href: "/members",
		label: "Members",
		icon: GoPeople,
		activeIcon: GoPeople,
	},
	{
		href: "/settings",
		label: "Settings",
		icon: Settings,
		activeIcon: Settings,
	},
];

"use client";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useMedia } from "react-use";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
} from "./ui/drawer";

export function ResponsiveModal({
	title,
	children,
	open,
	onOpenChange,
}: {
	title?: React.ReactNode;
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const isDesktop = useMedia("(min-width: 1024px)", true);

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<VisuallyHidden.Root>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>&nbsp;</DialogDescription>
				</VisuallyHidden.Root>
				<DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
					{children}
				</DialogContent>
			</Dialog>
		);
	}
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<VisuallyHidden.Root>
				<DrawerTitle>{title}</DrawerTitle>
				<DrawerDescription>&nbsp;</DrawerDescription>
			</VisuallyHidden.Root>
			<DrawerContent>
				<div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}

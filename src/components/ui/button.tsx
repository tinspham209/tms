import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"cursor-pointer disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:bg-neutral-100 disabled:from-neutral-100 disabled:to-neutral-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:text-neutral-300 border border-neutral-200 shadow-sm",
	{
		variants: {
			variant: {
				primary:
					"bg-gradient-to-b from-blue-600 to-blue-700 text-primary-foreground hover:from-blue-700 hover:to-blue-700",
				destructive:
					"bg-gradient-to-b from-amber-600 to-amber-700 text-primary-foreground hover:from-amber-700 hover:to-amber-700",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				secondary: "bg-white text-black hover:bg-neutral-100",
				ghost:
					"border-transparent shadow-none hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				muted: "bg-neutral-200 text-neutral-600 hover:bg-neutral-200/80",
				teritary:
					"bg-blue-100 text-blue-600 border-transparent hover:bg-blue-200 shadow-none",
			},
			size: {
				default: "h-10 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				xs: "h-7 rounded-md px-2 text-xs",
				lg: "h-12 rounded-md px-8 has-[>svg]:px-4",
				icon: "h-8 w-8",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	}
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };

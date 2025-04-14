import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const fontInter = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

type RootLayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<html lang="en">
			<body className={cn(fontInter.className, "antialiased min-h-screen")}>
				{children}
			</body>
		</html>
	);
}

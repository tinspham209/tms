"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignupSchema, signupSchema } from "../schemas";
import { useRegister } from "../query/use-Register";

export const SignUpCard = () => {
	const { mutate, isPending } = useRegister();

	const form = useForm<SignupSchema>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = (values: SignupSchema) => {
		mutate(values);
	};

	const isLoading = isPending;

	return (
		<Card className="w-full h-full md:w-[487px] border-none shadow-none">
			<CardHeader className="flex flex-col items-center justify-center text-center ">
				<CardTitle className="text-2xl">Sign Up</CardTitle>
				<CardDescription>
					By signing up, you agree to our{" "}
					<Link href="/privacy">
						<span className="text-blue-700">Privacy Policy</span>
					</Link>{" "}
					and{" "}
					<Link href="/terms">
						<span className="text-blue-700">Terms of Service</span>
					</Link>
				</CardDescription>
			</CardHeader>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="px-7 py-0">
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											type="text"
											placeholder="Enter your name"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											type="email"
											placeholder="Enter email address"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="Enter your password"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button disabled={isLoading} size="lg" className="w-full">
							Sign Up
						</Button>
					</form>
				</Form>
			</CardContent>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="px-7 py-0 flex flex-col gap-y-4">
				<Button
					disabled={isLoading}
					variant="secondary"
					size="lg"
					className="w-full"
				>
					<FcGoogle className="mr-2 size-5" />
					Login with Google
				</Button>
				<Button
					disabled={isLoading}
					variant="secondary"
					size="lg"
					className="w-full"
				>
					<FaGithub className="mr-2 size-5" />
					Login with Github
				</Button>
			</CardContent>
			<div className="px-7">
				<DottedSeparator />
			</div>

			<CardContent className="px-7 py-0 flex items-center justify-center">
				<p>
					Already have an account?{" "}
					<Link href="/sign-in">
						<span className="text-blue-700">&nbsp;Sign In</span>
					</Link>
				</p>
			</CardContent>
		</Card>
	);
};

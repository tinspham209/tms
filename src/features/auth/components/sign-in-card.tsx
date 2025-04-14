"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useLogin } from "../query/use-login";

export const SignInCard = () => {
	const { mutate, isPending } = useLogin();

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (values: LoginSchema) => {
		mutate(values);
	};

	const isLoading = isPending;

	return (
		<Card className="size-full md:w-[487px] border-none shadow-none">
			<CardHeader className="flex items-center justify-center text-center p-7">
				<CardTitle className="text-2xl">Welcome back!</CardTitle>
			</CardHeader>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7">
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
							Login
						</Button>
					</form>
				</Form>
			</CardContent>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7 flex flex-col gap-y-4">
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

			<CardContent className="p-7 flex items-center justify-center">
				<p>
					Don&apos;t have an account?{" "}
					<Link href="/sign-up">
						<span className="text-blue-700">&nbsp;Sign Up</span>
					</Link>
				</p>
			</CardContent>
		</Card>
	);
};

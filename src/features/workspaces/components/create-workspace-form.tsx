"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { compressImage } from "@/lib/compressor";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { useCreateWorkspace } from "../query/use-create-workspace";
import { createWorkSpaceSchema, CreateWorkSpaceSchema } from "../schemas";
import { useRouter } from "next/navigation";
import { Models } from "node-appwrite";

interface Props {
	onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: Props) => {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const { mutate, isPending } = useCreateWorkspace();

	const form = useForm<CreateWorkSpaceSchema>({
		resolver: zodResolver(createWorkSpaceSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (values: CreateWorkSpaceSchema) => {
		const payload = {
			...values,
			image:
				values.image instanceof File ? await compressImage(values.image) : "",
		};
		mutate(
			{ form: payload },
			{
				onSuccess: (data: any) => {
					const workspace: Models.Document = data?.data;
					const workspaceId = workspace.$id;

					form.reset();
					router.push(`/workspaces/${workspaceId}`);

					if (!!onCancel) {
						onCancel();
					}
				},
			}
		);
	};

	const onInvalidSubmit = (errors: FieldErrors<CreateWorkSpaceSchema>) => {
		console.log(errors);
	};

	const handImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue("image", file);
		}
	};

	const handleClickUpload = () => {
		inputRef.current?.click();
	};

	const isLoading = isPending;

	return (
		<Card className="w-full h-full border-none shadow-none">
			<CardHeader className="flex p-7">
				<CardTitle className="text-xl font-bold">
					Create a new workspace
				</CardTitle>
			</CardHeader>
			<div className="px-7">
				<DottedSeparator />
			</div>
			<CardContent className="p-7">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}>
						<div className="flex flex-col gap-y-4">
							<FormField
								name="name"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Workspace Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter workspace name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="image"
								control={form.control}
								render={({ field }) => (
									<div className="flex flex-col gap-y-2">
										<div className="flex items-center gap-x-5">
											{field.value ? (
												<div className="size-[72px] relative rounded-md overflow-hidden">
													<Image
														src={
															field.value instanceof File
																? URL.createObjectURL(field.value)
																: field.value
														}
														fill
														className="object-cover"
														alt="workspace-avatar"
													/>
												</div>
											) : (
												<Avatar className="size-[72px] flex items-center justify-center">
													<AvatarFallback>
														<ImageIcon className="size-[64px] text-neutral-400" />
													</AvatarFallback>
												</Avatar>
											)}
											<div className="flex flex-col">
												<p className="text-sm">Workspace Icon</p>
												<p className="text-sm text-muted-foreground">
													JPG, PNG, SVG, JPEG, WEBP, max 2MB
												</p>
												<input
													className="hidden"
													accept=".jpg, .png, .jpeg, .svg, .webp"
													ref={inputRef}
													type="file"
													disabled={isLoading}
													onChange={handImageChange}
												/>
												<Button
													disabled={isLoading}
													variant="teritary"
													size="xs"
													type="button"
													className="w-fit mt-2"
													onClick={handleClickUpload}
												>
													Upload Image
												</Button>
											</div>
										</div>
									</div>
								)}
							/>
						</div>

						<div className="flex items-center justify-between mt-7">
							<Button
								type="button"
								size="lg"
								variant="secondary"
								onClick={onCancel}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" size="lg" disabled={isLoading}>
								Create Workspace
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

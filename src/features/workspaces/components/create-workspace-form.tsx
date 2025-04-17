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
import { ChangeEvent, useMemo, useRef } from "react";
import { ControllerRenderProps, FieldErrors, useForm } from "react-hook-form";
import { useCreateWorkspace } from "../query/use-create-workspace";
import {
	createWorkspaceSchema,
	CreateWorkspaceSchema,
	Workspace,
} from "../schemas";
import { useRouter } from "next/navigation";
import { Models } from "node-appwrite";
import { cn, deepKeysHookFormErrors, scrollToTopError } from "@/lib/utils";
import { useUpdateWorkspace } from "../query/use-update-workspace";
import { useGetWorkspace } from "../query/use-get-workspace";
import { useGetFile } from "@/features/file/query/use-get-file";
import WorkspaceAvatar from "./workspace-avatar";

interface Props {
	onCancel?: () => void;
	workspaceId?: string;
}

export const CreateWorkspaceForm = ({ onCancel, workspaceId }: Props) => {
	const isEdit = !!workspaceId;
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const { mutate: onCreate, isPending: isCreating } = useCreateWorkspace();
	const { mutate: onUpdate, isPending: isUpdating } = useUpdateWorkspace();

	const { workspace } = useGetWorkspace({
		defaultParams: {
			workspaceId: workspaceId as string,
		},
	});

	console.log("workspace: ", workspace);

	const initValues = useMemo(() => {
		if (isEdit) {
			return {
				name: workspace?.name || "",
				image: workspace?.imageId || "",
			};
		}
		return {
			name: "",
			image: "",
		};
	}, [isEdit, workspace]);

	const form = useForm<CreateWorkspaceSchema>({
		resolver: zodResolver(createWorkspaceSchema),
		defaultValues: initValues,
		values: initValues,
		mode: "onBlur",
		reValidateMode: "onBlur",
	});

	const onSubmit = async (values: CreateWorkspaceSchema) => {
		const payload = {
			...values,
			image:
				values.image instanceof File ? await compressImage(values.image) : "",
		};
		if (isEdit) {
			onUpdate(
				{
					form: payload,
					param: {
						workspaceId: workspaceId as string,
					},
				},
				{
					onSuccess: (data: any) => {
						const workspace: Models.Document = data?.data;
						router.refresh();

						if (!!onCancel) {
							onCancel();
						}
					},
				}
			);
		} else {
			onCreate(
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
		}
	};

	const onInvalidSubmit = (errors: FieldErrors<CreateWorkspaceSchema>) => {
		console.log(errors);
		scrollToTopError(deepKeysHookFormErrors(errors));
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

	const handleRemoveImage = (
		field: ControllerRenderProps<CreateWorkspaceSchema, "image">
	) => {
		field.onChange(null);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const isLoading = isCreating || isUpdating;

	return (
		<Card className="w-full h-full border-none shadow-none">
			<CardHeader className="flex px-7">
				<CardTitle className="text-xl font-bold">
					{isEdit ? workspace.name : "Create a new "} Workspace
				</CardTitle>
			</CardHeader>
			<div className="px-7 ">
				<DottedSeparator />
			</div>
			<CardContent className="px-7">
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
													{field.value instanceof File ? (
														<Image
															src={URL.createObjectURL(field.value)}
															fill
															className="object-cover"
															alt="workspace-avatar"
														/>
													) : (
														<WorkspaceAvatar
															imageId={field.value}
															name={workspace?.name}
															className="w-full h-full"
														/>
													)}
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
													JPG, PNG, JPEG, WEBP, max 2MB
												</p>
												<input
													className="hidden"
													accept=".jpg, .png, .jpeg, .webp"
													ref={inputRef}
													type="file"
													disabled={isLoading}
													onChange={handImageChange}
												/>
												{field.value ? (
													<Button
														disabled={isLoading}
														variant="destructive"
														size="xs"
														type="button"
														className="w-fit mt-2"
														onClick={() => handleRemoveImage(field)}
													>
														Remove Image
													</Button>
												) : (
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
												)}
											</div>
										</div>
									</div>
								)}
							/>
							<DottedSeparator className="py-4" />
						</div>

						<div className="flex items-center justify-between">
							<Button
								type="button"
								size="lg"
								variant="secondary"
								onClick={onCancel}
								disabled={isLoading}
								className={cn(!onCancel && "invisible")}
							>
								Cancel
							</Button>
							<Button type="submit" size="lg" disabled={isLoading}>
								{isEdit ? "Update" : "Create"} Workspace
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

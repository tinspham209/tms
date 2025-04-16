"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetFile } from "@/features/file/query/use-get-file";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
	name: string;
	className?: string;
	imageId: string;
};

const WorkspaceAvatar = ({ name, className, imageId }: Props) => {
	const { data: imageUrl } = useGetFile({
		defaultParams: {
			fileId: imageId,
		},
	});

	if (!!imageUrl) {
		return (
			<div
				className={cn("size-10 relative rounded-md overflow-hidden", className)}
			>
				<Image
					src={(imageUrl as any) || ""}
					fill
					className="object-cover"
					alt="workspace-avatar"
				/>
			</div>
		);
	}

	return (
		<Avatar className={cn("size-10", className)}>
			<AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase">
				{name[0]}
			</AvatarFallback>
		</Avatar>
	);
};

export default WorkspaceAvatar;

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function generateInviteCode(length: number = 10) {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

export const isEmpty = (value: any): boolean => {
	return value instanceof Date
		? !isValid(value)
		: !value ||
				value === undefined ||
				value === null ||
				value === "undefined" ||
				value === "null" ||
				Number.isNaN(value) ||
				(typeof value === "object" && Object.keys(value).length === 0) ||
				(typeof value === "string" && value === "") ||
				(Array.isArray(value) && value.length === 0);
};

// link https://stackoverflow.com/questions/42674473/get-all-keys-of-a-deep-object-in-javascript
export const deepKeys = (t: unknown, path: string[] = []) => {
	const res: string[] =
		Object(t) === t
			? Object.entries(t) // 1
					.flatMap(([k, v]) => deepKeys(v, [...path, k]))
			: [path.join(".")]; // 2
	return res?.filter((x: string) => !/\d$/.test(x));
};

export const deepKeysHookFormErrors = (t: unknown, path: string[] = []) => {
	const res: string[] = deepKeys(t, path);

	const filteredRes = res.reduce((output: string[], item) => {
		if (/\d$/.test(item)) {
			return output;
		}

		const replacedItem = item.replace(/(\.type|\.message|\d)$/, "");

		output.push(replacedItem);

		return output;
	}, []);

	return [...new Set(filteredRes)];
};

export const scrollToTopError = (error: string[]) => {
	if (!isEmpty(error)) {
		const input = document.querySelector(`[name='${error[0]}']`);
		if (input) {
			const { parentElement } = input;
			parentElement?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			parentElement?.focus({ preventScroll: true });
		}
	}
};

import { createSessionClient } from "@/lib/appwrite";

export const getCurrent = async () => {
	try {
		const sessionClient = await createSessionClient();
		if (sessionClient instanceof Error) {
			throw sessionClient;
		}
		const { account } = sessionClient;

		return await account.get();
	} catch {
		return null;
	}
};

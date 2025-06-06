const env = process.env;

const envConfig = {
	APP_URL: env.NEXT_PUBLIC_APP_URL!,

	APPWRITE_ENDPOINT: env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
	APPWRITE_PROJECT: env.NEXT_PUBLIC_APPWRITE_PROJECT!,
	APPWRITE_KEY: env.NEXT_APPWRITE_KEY!,

	APPWRITE_DATABASE_ID: env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
	APPWRITE_BUCKET_ID: env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
	APPWRITE_WORKSPACES_ID: env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
	APPWRITE_MEMBERS_ID: env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
};

export default envConfig;

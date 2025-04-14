import { AppType } from "@/app/api/[[...route]]/route";
import envConfig from "@/configs/env";
import { hc } from "hono/client";

export const client = hc<AppType>(envConfig.APP_URL);

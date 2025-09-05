import {
  ADMIN_API_PATH,
  API_PORT,
  SHOP_API_PATH,
} from "@deenruv/common/shared-constants";
import { DeenruvConfig } from "@deenruv/core";
import path from "path";

export const devConfig: DeenruvConfig = {
  apiOptions: {
    port: API_PORT,
    adminApiPath: ADMIN_API_PATH,
    adminApiPlayground: { settings: { "request.credentials": "include" } },
    adminApiDebug: true,
    shopApiPath: SHOP_API_PATH,
    shopApiPlayground: { settings: { "request.credentials": "include" } },
    shopApiDebug: true,
  },
  authOptions: {
    disableAuth: false,
    tokenMethod: ["bearer", "cookie"] as const,
    requireVerification: true,
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_IDENTIFIER || "superadmin",
      password: process.env.SUPERADMIN_PASSWORD || "superpassword",
    },
    customPermissions: [],
    cookieOptions: { secret: "abc" },
  },
  dbConnectionOptions: {
    synchronize: false,
    logging: false,
    migrations: [path.join(__dirname, "migrations/*.ts")],
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "deenruv",
    password: process.env.DB_PASSWORD || "deenruv",
    database: process.env.DB_NAME || "deenruv",
    schema: process.env.DB_SCHEMA || "public",
  },
  paymentOptions: { paymentMethodHandlers: [] },
};

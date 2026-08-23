import "dotenv/config";

import { defineConfig } from "prisma/config";

const toolingDatabaseUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://prisma:prisma@localhost:5432/pathpilot";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: toolingDatabaseUrl,
  },
});

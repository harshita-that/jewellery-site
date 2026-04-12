import path from "node:path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), ".env.local") });

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    async adapter() {
      const { PrismaNeon } = await import("@prisma/adapter-neon");
      const { neonConfig, Pool } = await import("@neondatabase/serverless");
      const { default: ws } = await import("ws");

      neonConfig.webSocketConstructor = ws;

      const pool = new Pool({
        connectionString: process.env.DATABASE_URL!,
      });

      return new PrismaNeon(pool);
    },
  },
});
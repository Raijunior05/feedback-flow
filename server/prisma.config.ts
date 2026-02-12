import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: 'postgresql://admin:password123@localhost:5432/feedback_flow?schema=public',
  },
});
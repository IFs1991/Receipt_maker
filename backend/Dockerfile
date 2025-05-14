import React from 'react';

const Dockerfile: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800">
      <Card className="w-full bg-card mt-4">
        <CardHeader className="bg-card">
          <CardTitle className="bg-card">Dockerfile for Node.js TypeScript Application</CardTitle>
          <CardDescription className="bg-card">This Dockerfile is used to build and run a Node.js application using TypeScript.</CardDescription>
        </CardHeader>
        <CardContent className="bg-card">
          <pre className="text-sm">
            {`# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/app/database/prisma ./app/database/prisma

# Expose port and define command
EXPOSE \${PORT:-3001}
CMD ["node", "dist/server.js"]`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dockerfile;
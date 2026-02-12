FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable

FROM base AS deps

COPY . .

RUN pnpm install --frozen-lockfile

FROM deps AS builder

RUN pnpm --filter @devcon/web build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

CMD ["node", "apps/web/server.js"]


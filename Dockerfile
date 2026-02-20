FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app/.svelte-kit/output ./build
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1234
ENV ORIGIN=http://localhost:42069

EXPOSE 1234

CMD ["bun", "run", "build/server/index.js"]
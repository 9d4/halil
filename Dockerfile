FROM docker.io/oven/bun:1.3.1-slim AS build

WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile --ignore-scripts

RUN cd /app/packages/server && bun build --outfile /app/packages/server/server-bin --target bun index.ts
RUN cd /app/packages/web && bun run build
RUN [ -d "/app/packages/server/web/build" ] || { echo "Web build output missing"; exit 1; }

WORKDIR /app/packages/server
ENTRYPOINT ["bun", "/app/packages/server/server-bin"]

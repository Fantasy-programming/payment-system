# Base stage - Build dependencies
FROM oven/bun:1 as deps

# RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Create non-root user
ARG USERNAME=nonroot
ARG USER_GROUP=nonroot
RUN groupadd -g 10001 $USER_GROUP && useradd -m -u 10000 -g $USER_GROUP $USERNAME

# Make directories
RUN mkdir -p /temp/dev
RUN mkdir -p /temp/frontend

WORKDIR /temp/dev
COPY backend/package.json backend/bun.lockb ./
COPY backend/patches ./patches
RUN bun install --frozen-lockfile --production --no-cache

WORKDIR /temp/frontend
COPY frontend/package*.json ./
RUN bun install --frozen-lockfile --no-cache

# Build stage - Backend
FROM deps as backend-builder
WORKDIR /temp/dev
COPY --chown=${USERNAME}:${USER_GROUP} backend/ .
RUN bun build src/index.ts --compile --minify --sourcemap --outfile build/app

# Build stage - Frontend
FROM deps as frontend-builder
WORKDIR /temp/frontend
COPY frontend/ ./
RUN bun run build

# Final stage
FROM gcr.io/distroless/base:nonroot
COPY --from=backend-builder --chown=nonroot:nonroot /temp/dev/build ./dist/
COPY --from=frontend-builder --chown=nonroot:nonroot /temp/frontend/dist ./static

CMD ["./dist/app"]

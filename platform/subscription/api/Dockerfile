# Base stage
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Stage 1 (backend dev deps)
FROM base AS dev-deps
RUN mkdir -p /temp/dev
COPY backend/package.json backend/bun.lockb /temp/dev/
COPY backend/patches /temp/dev/patches
WORKDIR /temp/dev
RUN bun install --frozen-lockfile

# Stage 2 (production dev deps)
FROM base AS prod-deps
RUN mkdir -p /temp/prod
COPY backend/package.json backend/bun.lockb /temp/prod/
COPY backend/patches /temp/prod/patches
WORKDIR /temp/prod
RUN bun install --frozen-lockfile --production

# Stage 4 (Pre-release  - build, test, etc...)


# Stage 5 (Release)
FROM base as release 
COPY --from=prod-deps /temp/prod/node_modules node_modules
COPY --from=prod-deps /temp/prod/package.json .
COPY backend/src src

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]

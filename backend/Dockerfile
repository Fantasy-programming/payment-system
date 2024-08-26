# Base stage
FROM oven/bun:alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++

# Install all dependencies into temp
FROM base AS install
RUN mkdir -p /temp/dev
COPY backend/package.json backend/bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies
RUN mkdir -p /temp/prod
COPY backend/package.json backend/bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# install frontend  dependencies
RUN mkdir -p /temp/frontend
COPY frontend/package*.json /temp/frontend/
RUN cd /temp/frontend && bun install --frozen-lockfile 


# Backend build stage
FROM base AS backend-build
COPY --from=install /temp/dev/node_modules node_modules
COPY backend .

RUN bun run build

# Frontend build stage
FROM base AS frontend-build
WORKDIR /usr/src/frontend
COPY --from=install /temp/frontend/node_modules node_modules
COPY frontend ./
RUN bun run build


# Final stage
FROM oven/bun:distroless AS release
WORKDIR /usr/src/app

ARG USERNAME=nonroot
ARG USER_GROUP=nonroot


COPY --from=install /temp/prod/node_modules node_modules
COPY --from=backend-build /usr/src/app/dist ./dist
COPY --from=frontend-build /usr/src/frontend/dist ./static
COPY backend/package.json .

USER ${USERNAME}:${USER_GROUP}
EXPOSE 3000
CMD ["bun", "run", "dist/index.js"]

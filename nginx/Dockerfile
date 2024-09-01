# Build the frontend
FROM oven/bun:1 as base
WORKDIR /usr/src/app
COPY frontend/ .
RUN bun install --frozen-lockfile --no-cache && bun run build


FROM nginx:alpine

# COPY CONFIG 
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy Frontend
COPY --from=base /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

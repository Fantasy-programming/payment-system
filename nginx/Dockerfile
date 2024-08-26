FROM nginx:alpine

# Copy a custom main Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy your custom server block configuration
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

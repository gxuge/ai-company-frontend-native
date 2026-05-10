# syntax=docker/dockerfile:1.6
FROM nginx:1.25-alpine

COPY deploy/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 80


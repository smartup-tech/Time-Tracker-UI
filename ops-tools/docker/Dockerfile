FROM node:18.20.3-slim AS builder
WORKDIR /ui-app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=builder /ui-app/dist /var/www/timetracker
COPY ./ops-tools/docker/templates /etc/nginx/templates
COPY ./ops-tools/docker/conf/nginx.conf /etc/nginx/nginx.conf
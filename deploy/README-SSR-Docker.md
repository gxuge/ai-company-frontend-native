# SSR Docker Deployment (Expo Router)

This project is configured for Expo Router server rendering (`web.output: server`).
Use the files below to build and deploy an SSR container:

- `Dockerfile.ssr`
- `docker-compose.ssr.yml`

## 1) Build image

```bash
docker build -f Dockerfile.ssr -t ai-company-frontend-ssr:latest .
```

## 2) Run container

```bash
docker run -d \
  --name ai-company-frontend-ssr \
  -p 8081:8081 \
  --restart unless-stopped \
  ai-company-frontend-ssr:latest
```

Open:

- `http://<your-server-ip>:8081`

## 3) Run with Docker Compose

```bash
docker compose -f docker-compose.ssr.yml up -d --build
```

## 4) How it works

- Build stage runs `pnpm run build:web:ssr`.
- Expo exports SSR output to `dist/client` and `dist/server`.
- Runtime starts `expo serve dist --port 8081` in production mode.

## 5) Common cloud setup

1. Open security group / firewall TCP `8081`.
2. If you use a reverse proxy (Nginx/Caddy), proxy traffic to `127.0.0.1:8081`.
3. If native app API routes or server fetch are used in production, set the public origin in Expo Router plugin config.

Example Nginx reverse proxy:

```nginx
server {
  listen 80;
  server_name your.domain.com;

  location / {
    proxy_pass http://127.0.0.1:8081;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## 6) Update flow

```bash
git pull
docker compose -f docker-compose.ssr.yml up -d --build
```
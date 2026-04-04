# ══════════════════════════════════════════
# STAGE 1 — Build
# ══════════════════════════════════════════
FROM node:22-alpine AS builder
RUN mkdir -p /app && chown -R node:node /app
USER node
WORKDIR /app

COPY --chown=node:node frontend/app/package*.json ./
RUN npm ci
COPY --chown=node:node frontend/app/ .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_SSL_CERT_FILE
ENV VITE_SSL_CERT_FILE=$VITE_SSL_CERT_FILE
ARG VITE_SSL_KEY_FILE
ENV VITE_SSL_KEY_FILE=$VITE_SSL_KEY_FILE
ARG VITE_PORT
ENV VITE_PORT=$VITE_PORT
ARG VITE_YOUR_SERVICE_ID
ENV VITE_YOUR_SERVICE_ID=$VITE_YOUR_SERVICE_ID
ARG VITE_YOUR_TEMPLATE_ID
ENV VITE_YOUR_TEMPLATE_ID=$VITE_YOUR_TEMPLATE_ID
ARG VITE_YOUR_PUBLIC_KEY
ENV VITE_YOUR_PUBLIC_KEY=$VITE_YOUR_PUBLIC_KEY

RUN npm run build


# ══════════════════════════════════════════
# STAGE 2 — Serve
# ══════════════════════════════════════════
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
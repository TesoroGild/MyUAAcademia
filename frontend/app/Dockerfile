# ══════════════════════════════════════════
# STAGE 1 — Build
# ══════════════════════════════════════════
FROM node:22-alpine AS builder
RUN mkdir -p /app && chown -R node:node /app
USER node
WORKDIR /app

COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
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
FROM nginx:latest AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
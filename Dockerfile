# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Build args for Supabase (Railway에서 환경변수로 주입)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# nginx entrypoint가 시작 시 envsubst 처리 후 conf.d/default.conf 로 자동 배치
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway $PORT 미주입 시 fallback
ENV PORT=8080

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

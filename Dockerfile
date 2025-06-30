FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
# 2. Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Chỉ copy standalone + public
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
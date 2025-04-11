FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@latest-10

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build --configuration=production

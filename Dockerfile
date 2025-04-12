# While you can run this standalone, please use the root repo amytho/Osse on github. There is a compose file with instructions.

FROM node:22-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm@latest-10

RUN pnpm install

COPY . .

RUN pnpm run build --configuration=production

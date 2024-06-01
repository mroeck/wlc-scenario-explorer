FROM node:20-bookworm as base
WORKDIR /app
COPY pnpm-lock.yaml package.json /app/
RUN npm install -g pnpm && pnpm install
COPY . /app

FROM base as prod
RUN npm install -g serve
RUN pnpm build
CMD ["serve", "--single", "-p", "3001", "--no-port-switching", "dist"]

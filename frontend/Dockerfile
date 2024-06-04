FROM node:20-bookworm as base
WORKDIR /app
COPY pnpm-lock.yaml package.json /app/
RUN npm install -g pnpm@9.0.5 && pnpm install
COPY . /app

FROM base as prod
RUN pnpm build
CMD ["pnpm", "exec", "serve", "--single", "-p", "3001", "--no-port-switching", "dist"]

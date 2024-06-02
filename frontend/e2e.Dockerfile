FROM mcr.microsoft.com/playwright:v1.44.1-jammy

WORKDIR /app

COPY pnpm-lock.yaml package.json /app/

RUN npm install -g pnpm

RUN pnpm install

COPY . /app/

RUN pnpm exec playwright install

CMD ["pnpm", "run", "e2e"]

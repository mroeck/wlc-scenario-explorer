FROM mcr.microsoft.com/playwright:v1.45.1-jammy

WORKDIR /app/e2e

COPY ./e2e/package-lock.json ./e2e/package.json ./

RUN npm ci

WORKDIR /app/frontend/src
COPY ./frontend/src/env.ts .
COPY ./frontend/src/lib ./lib
COPY ./frontend/src/routes/-index/components/side-section/components ./routes/-index/components/side-section/components


WORKDIR /app/frontend/
COPY ./frontend/package.json .
RUN npm install -g pnpm@9.4.0 && pnpm install

WORKDIR /app/e2e
COPY ./e2e .


CMD ["npx", "playwright", "test"]

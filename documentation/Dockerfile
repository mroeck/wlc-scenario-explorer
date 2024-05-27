FROM node:20-alpine as base
WORKDIR /code
COPY pnpm-lock.yaml package.json /code/
RUN npm install -g pnpm && pnpm install
COPY . /code

FROM base AS dev
CMD ["pnpm", "run", "start", "--host", "0.0.0.0"]

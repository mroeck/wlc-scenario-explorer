FROM node:20-alpine as base
WORKDIR /code
COPY pnpm-lock.yaml package.json /code/
RUN npm install -g pnpm && pnpm install
COPY . /code

FROM base AS dev
# EXPOSE  3000
CMD ["pnpm", "run", "dev"]

FROM base as prod
RUN npm install -g serve
RUN pnpm build
# EXPOSE 3001
CMD ["serve", "--single", "-p", "3001", "--no-port-switching", "dist"]

FROM mcr.microsoft.com/playwright:v1.45.1-jammy

WORKDIR /app

COPY package-lock.json package.json /app/

RUN npm ci

COPY . /app/

CMD ["npx", "playwright", "test"]

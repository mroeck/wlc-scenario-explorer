FROM mcr.microsoft.com/playwright:v1.45.1-jammy

WORKDIR /app

COPY package-lock.json package.json /app/

RUN npm install

COPY . /app/

RUN npx playwright install

CMD ["npm", "run", "e2e"]

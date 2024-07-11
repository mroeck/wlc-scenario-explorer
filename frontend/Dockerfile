FROM node:20-slim as build
RUN npm install -g pnpm@9.0.5
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# Install dependencies
RUN pnpm install --frozen-lockfile
# Build the app
RUN pnpm build

# Bundle static assets in nginx image
FROM bitnami/nginx:1.27 as prod
ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=build /app/dist /app

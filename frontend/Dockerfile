FROM node:20-slim as build
ARG VITE_API_URL
RUN npm install -g pnpm@9.4.0
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# Install dependencies and build the app
RUN pnpm install --frozen-lockfile && \
    pnpm build 

# Bundle static assets in nginx image
FROM bitnami/nginx:1.27 as prod

### Change user to perform privileged actions
USER 0
### Install 'vim'
RUN install_packages curl
### Revert to the original non-root user
USER 1001

ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=build /app/dist /app

COPY ./nginx.conf /opt/bitnami/nginx/conf/server_blocks/spa.conf

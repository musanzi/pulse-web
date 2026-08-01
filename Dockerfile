FROM node:24-alpine AS base

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

FROM base AS dependencies

RUN pnpm install --frozen-lockfile

FROM dependencies AS development

COPY . .

FROM dependencies AS build

COPY . .
RUN pnpm build

FROM build AS production

WORKDIR /app
ENV NODE_ENV=production

RUN mkdir -p /app/data && chown -R node:node /app/data

USER node

EXPOSE 4200 4300

CMD ["node", "dist/website/server/server.mjs"]

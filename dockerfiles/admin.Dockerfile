FROM node:20 AS deps

ARG CI_JOB_TOKEN
ARG HOST=http://localhost:3000

ENV VITE_ADMIN_HOST_URL=$HOST

WORKDIR /app
RUN chown -R node:node /app

USER node
COPY --chown=node package.json package-lock.json ./
COPY --chown=node apps/panel/package.json ./apps/panel/

RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm config set //gitlab.aexol.com/:_authToken "$CI_JOB_TOKEN" \
  && npm config set @deenruv:registry https://gitlab.aexol.com/api/v4/packages/npm/ \
  && npm ci

FROM deps AS builder
USER node
COPY --chown=node . /app
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm run build:admin

FROM docker.io/nginx:1.25.5-alpine
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/panel/dist /usr/share/nginx/html/admin-ui
COPY --from=builder /app/apps/panel/nginx.conf /etc/nginx
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn install \
 && yarn cache clean

COPY . ./

RUN yarn build \
 && yarn bundle

FROM node:22-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist /usr/src/app/dist
COPY package.json yarn.lock ./

RUN yarn install --production \
 && yarn global add @blackglory/undead@0.1.2 \
 && yarn cache clean \
 && mkdir /data \
 && ln -s /data data

COPY . ./

ENV FTS_HOST=0.0.0.0
ENV FTS_PORT=8080
EXPOSE 8080
ENTRYPOINT ["undead"]
CMD ["yarn --silent", "start"]

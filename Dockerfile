FROM node:16-alpine AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn install \
 && yarn cache clean \
 && apk del .build-deps

COPY . ./

RUN yarn build \
 && yarn bundle

FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist /usr/src/app/dist
COPY package.json yarn.lock ./

RUN yarn install --production \
 && yarn cache clean \
 && mkdir /data \
 && ln -s /data data

COPY . ./

ENV FTS_HOST=0.0.0.0
ENV FTS_PORT=8080
EXPOSE 8080
ENTRYPOINT ["yarn"]
CMD ["--silent", "start"]

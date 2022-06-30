FROM node:16-alpine as tpb_custom_endpoint_service_compiler
RUN mkdir /app
WORKDIR /app

COPY . .

RUN yarn config set registry http://tlvmvnrepository.tlv.lpnet.com/artifactory/api/npm/lp-npm-virtual/

RUN npm install typescript -g
RUN yarn install
RUN yarn clean
RUN yarn build

FROM node:16-alpine as tpb_custom_endpoint_service
RUN mkdir /app
WORKDIR /app

COPY --from=tpb_custom_endpoint_service_compiler /app/package*.json ./
COPY --from=tpb_custom_endpoint_service_compiler /app/dist ./dist/

RUN yarn install --production

ENV NODE_ENV=PRODUCTION
ENV PORT=4004
CMD  yarn start:docker

EXPOSE 4004/tcp

FROM node:16-alpine as tpb_custom_endpoint_service
RUN mkdir /app
WORKDIR /app

COPY . .

RUN yarn config set registry http://tlvmvnrepository.tlv.lpnet.com/artifactory/api/npm/lp-npm-virtual/

RUN yarn install --production

ENV NODE_ENV=PRODUCTION
ENV PORT=4004

CMD yarn start

EXPOSE 4004/tcp

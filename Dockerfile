FROM node:16-alpine as tpb_custom_endpoint_service
WORKDIR /usr/app

COPY package.json ./

COPY yarn.lock ./
COPY tsconfig*.json ./

RUN npm install

COPY . ./

RUN npm run build

ENV NODE_ENV=PRODUCTION
EXPOSE 5000/tcp

CMD ["node", "dist/src/index.js"]

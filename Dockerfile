FROM node:14-alpine

ENV NODE_ENV production

WORKDIR /app
COPY app/package.json .
COPY app/.next/ .next/
COPY app/public/ public
COPY app/.env .
COPY app/next.config.js .
COPY node_modules/ node_modules/

EXPOSE 3000
CMD yarn start
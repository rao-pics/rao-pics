FROM node:alpine
RUN npm i -g pnpm
WORKDIR /app

COPY docker .
RUN pnpm install

EXPOSE 9600
CMD [ "node", "index.mjs" ]

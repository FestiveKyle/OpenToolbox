FROM node:lts-buster

WORKDIR /app

COPY package*.json .babelrc webpack.config.js server.js ./

RUN npm install

COPY ./src ./src

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "run", "build-start"]
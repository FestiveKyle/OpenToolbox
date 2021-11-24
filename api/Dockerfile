FROM node:lts-buster

WORKDIR /app

COPY package*.json .babelrc ./

RUN npm install

COPY ./src ./src
COPY ./server.js .

ENV NODE_ENV production

USER node
EXPOSE 4000

CMD ["npm", "start"]
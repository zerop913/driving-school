FROM node

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

COPY ./server/.env ./server/.env
COPY docker-compose.yml .

RUN yarn global add nodemon

EXPOSE 3000 5000

CMD yarn start & nodemon server/index.js
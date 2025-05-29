FROM node:18-alpine

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Install static file server
RUN yarn global add serve

CMD ["yarn", "start"]

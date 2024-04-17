FROM node:18-alpine

WORKDIR /app

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

RUN npm install

ADD . /app

RUN npm run build

EXPOSE "${APP_PORT}"

CMD ["npm", "start"]

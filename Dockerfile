FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install --only=prod && npm cache clean --force
COPY . /usr/src/app

CMD [ "npm", "start" ]

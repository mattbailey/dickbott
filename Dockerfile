FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ONBUILD COPY package.json /usr/src/app/
ONBUILD RUN npm install --production && npm cache clean --force
ONBUILD COPY . /usr/src/app
ONBUILD RUN npm run release

CMD [ "npm", "start" ]

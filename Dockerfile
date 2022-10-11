FROM node:16
WORKDIR /usr/src/app
COPY package.json ./

RUN npm install
COPY . .
CMD [ "npm","run", "init" ]
CMD [ "npm","run", "start" ]

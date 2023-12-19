FROM node:18

WORKDIR /usr/app

COPY . .

RUN npm install
RUN npm install -g pm2

# CMD ["npm", "run", "dev"]

CMD [ "npm", "start" ]
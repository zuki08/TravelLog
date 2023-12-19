FROM node:18

WORKDIR /usr/app

COPY . .

RUN npm install
RUN npm install -g pm2
RUN npm run build

# CMD ["npm", "run", "dev", "--", "--host"]
CMD [ "npm", "start" ]